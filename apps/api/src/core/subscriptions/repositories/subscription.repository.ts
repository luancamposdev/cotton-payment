import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';

export abstract class SubscriptionRepository {
  abstract create(subscription: SubscriptionEntity): Promise<void>;
  abstract findById(id: string): Promise<SubscriptionEntity | null>;
  abstract findByCustomerId(customerId: string): Promise<SubscriptionEntity[]>;
  abstract save(subscription: SubscriptionEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
