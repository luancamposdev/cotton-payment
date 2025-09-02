import { Injectable } from '@nestjs/common';
import { SubscriptionPlan as RawSubscriptionPlan } from '@prisma/client';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import {
  BillingIntervalType,
  BillingIntervalVO,
} from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

@Injectable()
export class PrismaSubscriptionPlanMapper {
  static toPrisma(plan: SubscriptionPlanEntity): RawSubscriptionPlan {
    return {
      id: plan.id,
      creatorId: plan.creatorId,
      name: plan.name.value,
      description: plan.description ?? null,
      price: plan.price.value,
      currency: plan.currency.value,
      billingInterval: plan.billingInterval.value,
      trialDays: plan.trialDays?.value ?? null,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  static toDomain(raw: RawSubscriptionPlan): SubscriptionPlanEntity {
    const billingInterval = raw.billingInterval as BillingIntervalType;

    return new SubscriptionPlanEntity(
      {
        creatorId: raw.creatorId,
        name: new SubscriptionNameVo(raw.name),
        description: raw.description ?? null,
        price: new PriceVO(Number(raw.price)),
        currency: new CurrencyVO(raw.currency),
        billingInterval: new BillingIntervalVO(billingInterval),
        trialDays:
          raw.trialDays !== null && raw.trialDays !== undefined
            ? new TrialDaysVO(Number(raw.trialDays))
            : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
