import { PayoutEntity } from '@core/payout/entities/payout.entity';

export class PayoutViewModel {
  static toHTTP(entity: PayoutEntity) {
    return {
      id: entity.id.value,
      creatorPayoutConfigId: entity.props.creatorPayoutConfigId.value,
      status: entity.props.status.value,
      amount: entity.props.amount.value,
      currency: entity.props.currency.value,
      scheduledAt: entity.props.scheduledAt?.value ?? null,
      processedAt: entity.props.processedAt?.value ?? null,
      providerPayoutId: entity.props.providerPayoutId?.value ?? null,
      rawPayload: entity.props.rawPayload?.value ?? null,
      createdAt: entity.props.createdAt,
      updatedAt: entity.props.updatedAt,
    };
  }
}
