import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSubscriptionPlanDto } from '@/interfaces/subscription-plan/dto/update-subscription-plan.dto';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';
import { FeaturesVO } from '@core/subscription-plans/value-objects/subscription-plan/features.vo';

@Injectable()
export class UpdateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateSubscriptionPlanDto,
  ): Promise<{ subscriptionPlan: SubscriptionPlanEntity }> {
    const subscriptionPlan = await this.subscriptionPlanRepository.findById(id);

    if (!subscriptionPlan) {
      throw new NotFoundException('Plano não encontrado.');
    }

    const updatedData = {
      ...(dto.name && { name: new SubscriptionNameVo(dto.name) }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: new PriceVO(dto.price) }),
      ...(dto.currency && { currency: new CurrencyVO(dto.currency) }),
      ...(dto.billingInterval && {
        billingInterval: new BillingIntervalVO(dto.billingInterval),
      }),
      ...(dto.trialDays !== undefined && {
        trialDays:
          dto.trialDays !== null ? new TrialDaysVO(dto.trialDays) : null,
      }),
      ...(dto.features && { features: new FeaturesVO(dto.features) }),
    };

    subscriptionPlan.updatePlan(updatedData);

    await this.subscriptionPlanRepository.save(subscriptionPlan);

    return { subscriptionPlan };
  }
}
