import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import { GetPayoutByIdUseCase } from '@application/payout/use-cases/get-payout-by-is.use-case';

import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';

describe('GetPayoutByIsUseCase', () => {
  let payoutRepository: InMemoryPayoutRepository;
  let getPayoutByIdUseCase: GetPayoutByIdUseCase;

  beforeEach(() => {
    payoutRepository = new InMemoryPayoutRepository();
    getPayoutByIdUseCase = new GetPayoutByIdUseCase(payoutRepository);
  });

  const makePayout = () =>
    PayoutEntity.create({
      creatorPayoutConfigId: new CreatorPayoutConfigIdVO('creator-123'),
      amount: new PayoutAmountVO(1000),
      currency: new PayoutCurrencyVO('BRL'),
      status: PayoutStatusVO.create('PENDING'),
    });

  it('should return a payout if it exists', async () => {
    const payout = makePayout();
    await payoutRepository.create(payout);

    const payoutFound = await getPayoutByIdUseCase.execute({
      id: payout.id.value,
    });

    expect(payoutFound.payout).toBe(payout);
    expect(payoutFound.payout.props.status.value).toBe('PENDING');
  });

  it('should throw an error if the payout does not exist', async () => {
    await expect(
      getPayoutByIdUseCase.execute({ id: 'non-existent-id' }),
    ).rejects.toThrow('Pagamento não encontrado.');
  });
});
