import { Payout, PayoutStatus, Prisma } from '@prisma/client';
import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutScheduleAtVo } from '@core/payout/value-objects/payout-scheduleAt.vo';
import { PayoutProcessedAtVO } from '@core/payout/value-objects/payout-processedAt.vo';
import { ProviderPayoutIdVO } from '@core/payout/value-objects/provider-payout-id.vo';
import { PayoutRawPayloadVO } from '@core/payout/value-objects/payout-raw-payload.vo';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';

export class PayoutMapper {
  static toPersistence(
    entity: PayoutEntity,
  ): Prisma.PayoutUncheckedCreateInput {
    const props = entity.props;

    return {
      id: entity.id.value,
      creatorPayoutConfigId: props.creatorPayoutConfigId.value,
      status: props.status.value as PayoutStatus,
      amount: props.amount.value * 100,
      currency: props.currency.value,
      scheduledAt: props.scheduledAt ? props.scheduledAt.value : null,
      processedAt: props.processedAt ? props.processedAt.value : null,
      providerPayoutId: props.providerPayoutId
        ? props.providerPayoutId.value
        : null,
      rawPayload: props.rawPayload ? props.rawPayload.value : Prisma.DbNull,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  static toEntity(model: Payout): PayoutEntity {
    return PayoutEntity.create(
      {
        creatorPayoutConfigId: new CreatorPayoutConfigIdVO(
          model.creatorPayoutConfigId,
        ),
        status: PayoutStatusVO.create(model.status),
        amount: new PayoutAmountVO(model.amount / 100),
        currency: new PayoutCurrencyVO(model.currency),
        scheduledAt: model.scheduledAt
          ? new PayoutScheduleAtVo(model.scheduledAt)
          : null,
        processedAt: model.processedAt
          ? new PayoutProcessedAtVO(model.processedAt)
          : null,
        providerPayoutId: model.providerPayoutId
          ? new ProviderPayoutIdVO(model.providerPayoutId)
          : null,
        rawPayload: model.rawPayload
          ? new PayoutRawPayloadVO(model.rawPayload)
          : null,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      new PayoutIdVO(model.id),
    );
  }
}
