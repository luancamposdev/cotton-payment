import { SubscriptionEntity } from '../entities/subscription.entity';
import { SubscriptionStatusVO } from '../value-objects/subscription-status.vo';

export class SubscriptionStatusService {
  static recalculate(
    subscription: SubscriptionEntity,
    now: Date = new Date(),
  ): SubscriptionEntity {
    const current = subscription.status.value;

    // estados que não devem ser sobrescritos automaticamente
    if (current === 'CANCELLED') return subscription;

    // ainda não começou
    if (subscription.startDate > now) return subscription;

    // expirado por data de término
    if (subscription.endDate !== null && now > subscription.endDate) {
      if (current !== 'EXPIRED') {
        subscription.status = new SubscriptionStatusVO('EXPIRED');
        subscription.touch();
      }
      return subscription;
    }

    // período de trial
    if (subscription.trialEndsAt !== null && now < subscription.trialEndsAt) {
      if (current !== 'TRIAL') {
        subscription.status = new SubscriptionStatusVO('TRIAL');
        subscription.touch();
      }
      return subscription;
    }

    // ativo (fallback)
    if (current !== 'ACTIVE') {
      subscription.status = new SubscriptionStatusVO('ACTIVE');
      subscription.touch();
    }

    return subscription;
  }
}
