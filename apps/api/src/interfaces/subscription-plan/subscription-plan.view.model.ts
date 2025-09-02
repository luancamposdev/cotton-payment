import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

export class SubscriptionPlanViewModel {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billingInterval: string;
  trialDays: number | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;

  static toHTTP(plan: SubscriptionPlanEntity): SubscriptionPlanViewModel {
    return {
      id: plan.id,
      name: plan.name.value,
      description: plan.description,
      price: plan.price.value,
      currency: plan.currency.value,
      billingInterval: plan.billingInterval.value,
      trialDays: plan.trialDays?.value ?? null,
      creatorId: plan.creatorId,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
