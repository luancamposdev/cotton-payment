import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import { MarkPayoutAsProcessedUseCase } from '@application/payout/use-cases/mark-payout-as-processed-use-case';
import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';

describe('MarkPayoutAsProcessedUseCase', () => {
  let payoutRepository: InMemoryPayoutRepository;
  let markPayoutAsProcessedUseCase: MarkPayoutAsProcessedUseCase;

  beforeEach(() => {
    payoutRepository = new InMemoryPayoutRepository();
    markPayoutAsProcessedUseCase = new MarkPayoutAsProcessedUseCase(
      payoutRepository,
    );
  });

  const makePayout = () =>
    PayoutEntity.create({
      creatorPayoutConfigId: new CreatorPayoutConfigIdVO('creator-123'),
      amount: new PayoutAmountVO(1000),
      currency: new PayoutCurrencyVO('BRL'),
      status: PayoutStatusVO.create('PENDING'),
    });

  it('should mark a payout as processed', async () => {
    const payout = makePayout();
    await payoutRepository.create(payout);

    const { payout: processed } = await markPayoutAsProcessedUseCase.execute({
      payoutId: payout.id.value,
      providerPayoutId: 'provider-456',
    });

    expect(processed.props.status.value).toBe('COMPLETED');
    expect(processed.props.providerPayoutId?.value).toBe('provider-456');
    expect(processed.props.processedAt?.value).toBeInstanceOf(Date);
  });

  it('should throw an error if payout does not exist', async () => {
    await expect(
      markPayoutAsProcessedUseCase.execute({
        payoutId: 'non-existent-id',
        providerPayoutId: 'provider-456',
      }),
    ).rejects.toThrow('Pagamento não encontrado.');
  });
});
