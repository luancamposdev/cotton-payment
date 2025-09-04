import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';

export class SubscriptionViewModel {
  static toHTTP(subscription: SubscriptionEntity) {
    return {
      id: subscription.id,
      customerId: subscription.customerId,
      planId: subscription.planId,
      status: subscription.status.value,
      startDate: subscription.startDate,
      trialEndsAt: subscription.trialEndsAt,
      endDate: subscription.endDate,
      renewalAt: subscription.renewalAt,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  static toHTTPList(subscriptions: SubscriptionEntity[]) {
    return subscriptions.map((subscription) =>
      SubscriptionViewModel.toHTTP(subscription),
    );
  }
}
