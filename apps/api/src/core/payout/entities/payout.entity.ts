import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { ProviderPayoutIdVO } from '@core/payout/value-objects/provider-payout-id.vo';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { PayoutScheduleAtVo } from '@core/payout/value-objects/payout-scheduleAt.vo';
import { PayoutRawPayloadVO } from '@core/payout/value-objects/payout-raw-payload.vo';
import { PayoutProcessedAtVO } from '@core/payout/value-objects/payout-processedAt.vo';

export interface PayoutProps {
  creatorPayoutConfigId: CreatorPayoutConfigIdVO;
  status: PayoutStatusVO;
  amount: PayoutAmountVO;
  currency: PayoutCurrencyVO;
  scheduledAt?: PayoutScheduleAtVo | null;
  processedAt?: PayoutProcessedAtVO | null;
  providerPayoutId?: ProviderPayoutIdVO | null;
  rawPayload?: PayoutRawPayloadVO | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PayoutEntity {
  private constructor(
    public readonly id: PayoutIdVO,
    public props: PayoutProps,
  ) {}

  public static create(props: PayoutProps, id?: PayoutIdVO): PayoutEntity {
    return new PayoutEntity(id ?? new PayoutIdVO(crypto.randomUUID()), {
      ...props,
      processedAt: props.processedAt ?? null,
      providerPayoutId: props.providerPayoutId ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  updateStatus(newStatus: PayoutStatusVO) {
    this.props.status = newStatus;
    this.touch();
  }

  markAsProcessed(providerPayoutId: ProviderPayoutIdVO) {
    this.props.status = new PayoutStatusVO('COMPLETED');
    this.props.processedAt = new PayoutProcessedAtVO(new Date());
    this.props.providerPayoutId = providerPayoutId;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
