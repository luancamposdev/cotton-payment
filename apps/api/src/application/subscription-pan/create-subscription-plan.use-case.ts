import { Injectable } from '@nestjs/common';

import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

interface ICreateSubscriptionPlanRequest {
  creatorId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingInterval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  trialDays?: number;
}

interface ICreateSubscriptionPlanResponse {
  subscriptionPlan: SubscriptionPlanEntity;
}

@Injectable()
export class CreateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    request: ICreateSubscriptionPlanRequest,
  ): Promise<ICreateSubscriptionPlanResponse> {
    const {
      creatorId,
      name,
      description,
      price,
      currency,
      billingInterval,
      trialDays,
    } = request;

    const subscriptionPlan = new SubscriptionPlanEntity({
      creatorId,
      name: new SubscriptionNameVo(name),
      description: description ?? null,
      price: new PriceVO(price),
      currency: new CurrencyVO(currency),
      billingInterval: new BillingIntervalVO(billingInterval),
      trialDays: trialDays !== undefined ? new TrialDaysVO(trialDays) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.subscriptionPlanRepository.create(subscriptionPlan);

    return { subscriptionPlan };
  }
}
