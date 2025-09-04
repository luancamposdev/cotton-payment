import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';

export class InMemorySubscriptionRepository implements SubscriptionRepository {
  private subscriptions: SubscriptionEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(subscription: SubscriptionEntity): Promise<void> {
    this.subscriptions.push(subscription);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<SubscriptionEntity | null> {
    const subscription = this.subscriptions.find(
      (subscription) => subscription.id === id,
    );

    return subscription ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByCustomerId(customerId: string): Promise<SubscriptionEntity[]> {
    return this.subscriptions.filter(
      (subscription) => subscription.customerId === customerId,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(subscription: SubscriptionEntity): Promise<void> {
    const index = this.subscriptions.findIndex(
      (subscription) => subscription.id === subscription.id,
    );

    if (index >= 0) {
      this.subscriptions[index] = subscription;
    }
  }
}
