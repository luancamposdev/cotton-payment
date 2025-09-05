import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';

describe('SubscriptionEntity', () => {
  it('should create a subscription entity with correct values', () => {
    const subscription = new SubscriptionEntity({
      customerId: 'customer-123',
      planId: 'plan-456',
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date('2025-01-01'),
      endDate: null,
      renewalAt: null,
      trialEndsAt: null,
    });

    expect(subscription).toBeDefined();
    expect(subscription.customerId).toBe('customer-123');
    expect(subscription.planId).toBe('plan-456');
    expect(subscription.status.value).toBe('ACTIVE');
    expect(subscription.startDate).toBeInstanceOf(Date);
    expect(subscription.endDate).toBeNull();
    expect(subscription.renewalAt).toBeNull();
    expect(subscription.createdAt).toBeInstanceOf(Date);
    expect(subscription.updatedAt).toBeInstanceOf(Date);
  });

  it('should update subscription status', () => {
    const subscription = new SubscriptionEntity({
      customerId: 'customer-123',
      planId: 'plan-456',
      endDate: null,
      renewalAt: null,
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date(),
      trialEndsAt: null,
    });

    subscription.status = new SubscriptionStatusVO('CANCELLED');

    expect(subscription.status.value).toBe('CANCELLED');
    expect(subscription.updatedAt).toBeInstanceOf(Date);
  });

  it('should update endDate', () => {
    const subscription = new SubscriptionEntity({
      customerId: 'customer-123',
      planId: 'plan-456',
      endDate: new Date('2025-10-04T02:02:25.530Z'),
      renewalAt: null,
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date(),
      trialEndsAt: null,
    });

    const newEndDate = new Date('2025-12-31');
    subscription.endDate = newEndDate;

    expect(subscription.endDate).toEqual(newEndDate);
    expect(subscription.updatedAt).toBeInstanceOf(Date);
  });

  it('should update renewalAt', () => {
    const subscription = new SubscriptionEntity({
      customerId: 'customer-123',
      planId: 'plan-456',
      endDate: new Date('2025-10-04T02:02:25.530Z'),
      renewalAt: new Date('2025-09-12T02:02:25.530Z'),
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date(),
      trialEndsAt: null,
    });

    const renewalDate = new Date('2025-06-30');
    subscription.renewalAt = renewalDate;

    expect(subscription.renewalAt).toEqual(renewalDate);
    expect(subscription.updatedAt).toBeInstanceOf(Date);
  });

  it('should update subscription using updateSubscription method', () => {
    const subscription = new SubscriptionEntity({
      customerId: 'customer-123',
      planId: 'plan-456',
      endDate: new Date('2025-10-04T02:02:25.530Z'),
      renewalAt: new Date('2025-09-12T02:02:25.530Z'),
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date(),
      trialEndsAt: null,
    });

    const newStatus = new SubscriptionStatusVO('TRIAL');
    const newEndDate = new Date('2026-01-01');

    subscription.updateSubscription({
      status: newStatus,
      endDate: newEndDate,
    });

    expect(subscription.status.value).toBe('ACTIVE');
    expect(subscription.endDate).toEqual(newEndDate);
    expect(subscription.updatedAt).toBeInstanceOf(Date);
  });
});
