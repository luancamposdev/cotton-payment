import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';

import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/create-subscription-plan.use-case';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';

describe('CreateSubscriptionsUseCase', () => {
  it('should create a subscription successfully', async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository();
    const customerRepository = new InMemoryCustomerRepository();
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();

    const createSubscriptionUseCase = new CreateSubscriptionUseCase(
      subscriptionRepository,
      customerRepository,
      subscriptionPlanRepository,
    );
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );

    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-123',
      defaultAddressId: 'address-id',
    });

    const { subscriptionPlan } = await createSubscriptionPlanUseCase.execute({
      creatorId: 'creator-456',
      name: 'Basic Plan',
      price: 999,
      currency: 'BRL',
      billingInterval: 'MONTHLY',
      description: null,
      trialDays: null,
    });

    const result = await createSubscriptionUseCase.execute({
      customerId: customer.id,
      planId: subscriptionPlan.id,
    });

    expect(result.subscription).toBeInstanceOf(SubscriptionEntity);
    expect(result.subscription.customerId).toBe(customer.id);
    expect(result.subscription.planId).toBe(subscriptionPlan.id);
    expect(result.subscription.status.value).toBe('PENDING');

    const persisted = await subscriptionRepository.findById(
      result.subscription.id,
    );

    expect(persisted).not.toBeNull();
    expect(persisted?.id).toBe(result.subscription.id);
  });

  it('should throw if customer does not exist', async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository();
    const customerRepository = new InMemoryCustomerRepository();
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();

    const createSubscriptionUseCase = new CreateSubscriptionUseCase(
      subscriptionRepository,
      customerRepository,
      subscriptionPlanRepository,
    );

    await expect(
      createSubscriptionUseCase.execute({
        customerId: 'invalid',
        planId: 'valid-plan',
      }),
    ).rejects.toThrow('Customer not found');
  });

  it('should throw if plan does not exist', async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository();
    const customerRepository = new InMemoryCustomerRepository();
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();

    const createSubscriptionUseCase = new CreateSubscriptionUseCase(
      subscriptionRepository,
      customerRepository,
      subscriptionPlanRepository,
    );

    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-123',
      defaultAddressId: 'address-id',
    });

    await expect(
      createSubscriptionUseCase.execute({
        customerId: customer.id,
        planId: 'invalid',
      }),
    ).rejects.toThrow('Subscription plan not found');
  });
});
