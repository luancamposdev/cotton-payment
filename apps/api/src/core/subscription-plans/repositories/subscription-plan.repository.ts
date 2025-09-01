import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

export abstract class SubscriptionPlanRepository {
  abstract create(subscriptionPlan: SubscriptionPlanEntity): Promise<void>;
  abstract findById(id: string): Promise<SubscriptionPlanEntity | null>;
  abstract findByCreatorId(
    creatorId: string,
  ): Promise<SubscriptionPlanEntity[]>;
  abstract save(subscriptionPlan: SubscriptionPlanEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
