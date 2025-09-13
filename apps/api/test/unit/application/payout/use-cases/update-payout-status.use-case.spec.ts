import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import { UpdatePayoutStatusUseCase } from '@application/payout/use-cases/update-payout-status.use-case';
import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { NotFoundException } from '@nestjs/common';

describe('UpdatePayoutStatusUseCase', () => {
  let payoutRepository: InMemoryPayoutRepository;
  let updatePayoutStatusUseCase: UpdatePayoutStatusUseCase;

  const makePayout = (status: string) =>
    PayoutEntity.create({
      creatorPayoutConfigId: new CreatorPayoutConfigIdVO('creator-123'),
      amount: new PayoutAmountVO(1000),
      currency: new PayoutCurrencyVO('BRL'),
      status: PayoutStatusVO.create(status),
    });

  beforeEach(() => {
    payoutRepository = new InMemoryPayoutRepository();
    updatePayoutStatusUseCase = new UpdatePayoutStatusUseCase(payoutRepository);
  });

  it('should throw an error if payout does not exist', async () => {
    await expect(
      updatePayoutStatusUseCase.execute({
        payoutId: 'non-existent',
        status: PayoutStatusVO.create('PENDING'),
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update the payout status successfully', async () => {
    const payout = makePayout('PENDING');
    await payoutRepository.create(payout);

    const newStatus = PayoutStatusVO.create('COMPLETED');

    const { payout: updated } = await updatePayoutStatusUseCase.execute({
      payoutId: payout.id.value,
      status: newStatus,
    });

    expect(updated.props.status.value).toBe('COMPLETED');

    const persisted = await payoutRepository.findById(payout.id);
    expect(persisted?.props.status.value).toBe('COMPLETED');
  });
});
