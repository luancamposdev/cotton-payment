import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import { CancelPayoutUseCase } from '@application/payout/use-cases/cancel-payout-use-case';

import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';

describe('CancelPayoutUseCase with InMemoryRepository', () => {
  let payoutRepository: InMemoryPayoutRepository;
  let cancelPayoutUseCase: CancelPayoutUseCase;

  const makePayout = (status: string) =>
    PayoutEntity.create({
      creatorPayoutConfigId: new CreatorPayoutConfigIdVO('creator-123'),
      amount: new PayoutAmountVO(1000),
      currency: new PayoutCurrencyVO('BRL'),
      status: PayoutStatusVO.create(status),
    });

  beforeEach(() => {
    payoutRepository = new InMemoryPayoutRepository();
    cancelPayoutUseCase = new CancelPayoutUseCase(payoutRepository);
  });

  it('should throw an error if the payout does not exist', async () => {
    await expect(
      cancelPayoutUseCase.execute({ payoutId: 'non-existent-id' }),
    ).rejects.toThrow('Pagamento não encontrado.');
  });

  it('should throw an error if the payout is already COMPLETED', async () => {
    const payout = makePayout('COMPLETED');
    await payoutRepository.create(payout);

    await expect(
      cancelPayoutUseCase.execute({ payoutId: payout.id.value }),
    ).rejects.toThrow('Não é possível cancelar um pagamento já concluído');
  });

  it('should successfully cancel the payout', async () => {
    const payout = makePayout('PENDING');
    await payoutRepository.create(payout);

    const result = await cancelPayoutUseCase.execute({
      payoutId: payout.id.value,
    });

    expect(result.payout.props.status.value).toBe('CANCELLED');

    const persisted = await payoutRepository.findById(result.payout.id);

    expect(persisted).toBeDefined();
    expect(persisted?.props.status.value).toBe('CANCELLED');
  });
});
