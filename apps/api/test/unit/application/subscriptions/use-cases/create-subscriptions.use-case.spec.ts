import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';

import { CustomerEntity } from '@core/customer/entities/customer.entity';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';

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

    await customerRepository.create(
      new CustomerEntity(
        {
          userId: 'user-123',
          defaultAddressId: 'address-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        'valid-customer',
      ),
    );

    await subscriptionPlanRepository.create(
      new SubscriptionPlanEntity(
        {
          creatorId: 'creator-456',
          name: new SubscriptionNameVo('Basic Plan'),
          price: new PriceVO(999),
          currency: new CurrencyVO('BRL'),
          billingInterval: new BillingIntervalVO('MONTHLY'),
          description: null,
          trialDays: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        'valid-plan',
      ),
    );

    const result = await createSubscriptionUseCase.execute({
      customerId: 'valid-customer',
      planId: 'valid-plan',
    });

    expect(result.subscription).toBeInstanceOf(SubscriptionEntity);
    expect(result.subscription.customerId).toBe('valid-customer');
    expect(result.subscription.planId).toBe('valid-plan');
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

    await customerRepository.create(
      new CustomerEntity(
        {
          userId: 'user-123',
          defaultAddressId: 'address-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        'valid-customer',
      ),
    );

    await expect(
      createSubscriptionUseCase.execute({
        customerId: 'valid-customer',
        planId: 'invalid',
      }),
    ).rejects.toThrow('Subscription plan not found');
  });
});
