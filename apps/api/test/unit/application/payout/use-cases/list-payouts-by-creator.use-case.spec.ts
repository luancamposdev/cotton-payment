import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import { ListPayoutsByCreatorUseCase } from '@application/payout/use-cases/list-payouts-by-creator.use-case';

import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';

describe('ListPayoutsByCreatorUseCase with InMemoryRepository', () => {
  let payoutRepository: InMemoryPayoutRepository;
  let listPayoutsByCreatorUseCase: ListPayoutsByCreatorUseCase;

  beforeEach(() => {
    payoutRepository = new InMemoryPayoutRepository();
    listPayoutsByCreatorUseCase = new ListPayoutsByCreatorUseCase(
      payoutRepository,
    );
  });

  const makePayout = (creatorId: string) =>
    PayoutEntity.create({
      creatorPayoutConfigId: new CreatorPayoutConfigIdVO(creatorId),
      amount: new PayoutAmountVO(1000),
      currency: new PayoutCurrencyVO('BRL'),
      status: PayoutStatusVO.create('PENDING'),
    });

  it('should return all payouts for a given creator', async () => {
    const payout1 = makePayout('creator-123');
    const payout2 = makePayout('creator-123');
    const payoutOther = makePayout('creator-456');

    await payoutRepository.create(payout1);
    await payoutRepository.create(payout2);
    await payoutRepository.create(payoutOther);

    const { payouts } = await listPayoutsByCreatorUseCase.execute({
      creatorPayoutConfigId: 'creator-123',
    });

    expect(payouts).toHaveLength(2);
    expect(payouts.map((p) => p.id.value)).toEqual(
      expect.arrayContaining([payout1.id.value, payout2.id.value]),
    );
  });

  it('should return an empty array if the creator has no payouts', async () => {
    const { payouts } = await listPayoutsByCreatorUseCase.execute({
      creatorPayoutConfigId: 'non-existent-creator',
    });

    expect(payouts).toHaveLength(0);
  });
});
