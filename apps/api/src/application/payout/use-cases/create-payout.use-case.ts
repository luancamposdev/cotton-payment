import { BadRequestException, Injectable } from '@nestjs/common';

import { PayoutEntity, PayoutProps } from '@core/payout/entities/payout.entity';
import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';
import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';
import { PayoutScheduleAtVo } from '@core/payout/value-objects/payout-scheduleAt.vo';
import { PayoutRawPayloadVO } from '@core/payout/value-objects/payout-raw-payload.vo';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';

export interface CreatePayoutRequest {
  creatorPayoutConfigId: string;
  amount: number;
  currency?: string;
  scheduleAt?: Date;
  rawPayload?: Record<string, any>;
}

export interface CreatePayoutResponse {
  payout: PayoutEntity;
}

@Injectable()
export class CreatePayoutUseCase {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  async execute(request: CreatePayoutRequest): Promise<CreatePayoutResponse> {
    const { creatorPayoutConfigId, amount, currency, scheduleAt, rawPayload } =
      request;

    if (!creatorPayoutConfigId) {
      throw new BadRequestException('CreatorPayoutConfigId is required');
    }
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const creatorPayoutConfigIdVO = new CreatorPayoutConfigIdVO(
      creatorPayoutConfigId,
    );
    const amountVO = new PayoutAmountVO(amount);
    const currencyVO = new PayoutCurrencyVO(currency ?? 'BRL');
    const statusVO = new PayoutStatusVO('PENDING');
    const scheduledAtVO = scheduleAt
      ? new PayoutScheduleAtVo(scheduleAt)
      : null;
    const rawPayloadVO = rawPayload ? new PayoutRawPayloadVO(rawPayload) : null;

    const payoutProps: PayoutProps = {
      creatorPayoutConfigId: creatorPayoutConfigIdVO,
      amount: amountVO,
      currency: currencyVO,
      status: statusVO,
      scheduledAt: scheduledAtVO,
      rawPayload: rawPayloadVO,
    };

    const payout = PayoutEntity.create(payoutProps);

    await this.payoutRepository.create(payout);

    return { payout };
  }
}
