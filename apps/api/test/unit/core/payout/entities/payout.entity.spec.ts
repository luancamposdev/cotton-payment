import { PayoutEntity, PayoutProps } from '@core/payout/entities/payout.entity';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutScheduleAtVo } from '@core/payout/value-objects/payout-scheduleAt.vo';
import { PayoutRawPayloadVO } from '@core/payout/value-objects/payout-raw-payload.vo';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { ProviderPayoutIdVO } from '@core/payout/value-objects/provider-payout-id.vo';
import { PayoutProcessedAtVO } from '@core/payout/value-objects/payout-processedAt.vo';

describe('PayoutEntity', () => {
  let props: PayoutProps;

  beforeEach(() => {
    props = {
      creatorPayoutConfigId: new CreatorPayoutConfigIdVO('config-123'),
      status: new PayoutStatusVO('PENDING'),
      amount: new PayoutAmountVO(10000),
      currency: new PayoutCurrencyVO('BRL'),
      scheduledAt: new PayoutScheduleAtVo(
        new Date(Date.now() + 1000 * 60 * 60),
      ),
      processedAt: null,
      providerPayoutId: null,
      rawPayload: new PayoutRawPayloadVO({
        provider: 'stripe',
        transactionId: 'tx_123',
        status: 'pending',
      }),
    };
  });

  it('deve criar payout corretamente', () => {
    const payout = PayoutEntity.create(props);

    expect(payout.id).toBeInstanceOf(PayoutIdVO);
    expect(payout.props.status.value).toBe('PENDING');
    expect(payout.props.amount.value).toBe(10000);
    expect(payout.props.currency.value).toBe('BRL');
    expect(payout.props.processedAt).toBeNull();
    expect(payout.props.providerPayoutId).toBeNull();
  });

  it('deve atualizar o status', () => {
    const payout = PayoutEntity.create(props);
    payout.updateStatus(new PayoutStatusVO('FAILED'));
    expect(payout.props.status.value).toBe('FAILED');
  });

  it('deve marcar payout como processado', () => {
    const payout = PayoutEntity.create(props);
    const providerId = new ProviderPayoutIdVO('prov-123456');

    payout.markAsProcessed(providerId);

    expect(payout.props.status.value).toBe('COMPLETED');
    expect(payout.props.processedAt).toBeInstanceOf(PayoutProcessedAtVO);
    expect(payout.props.processedAt?.isProcessed()).toBe(true);
    expect(payout.props.providerPayoutId).toBe(providerId);
  });

  it('deve preencher createdAt e updatedAt automaticamente', () => {
    const payout = PayoutEntity.create(props);
    expect(payout.props.createdAt).toBeInstanceOf(Date);
    expect(payout.props.updatedAt).toBeInstanceOf(Date);
  });
});
