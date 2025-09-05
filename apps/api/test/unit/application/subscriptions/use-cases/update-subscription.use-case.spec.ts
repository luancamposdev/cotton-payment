import { UpdateSubscriptionUseCase } from '@application/subscriptions/update-subscription.use-case';
import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/create-subscription-plan.use-case';

describe('UpdateSubscriptionUseCase', () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let customerRepository: InMemoryCustomerRepository;
  let subscriptionPlanRepository: InMemorySubscriptionPlanRepository;
  let createSubscriptionUseCase: CreateSubscriptionUseCase;
  let updateSubscriptionUseCase: UpdateSubscriptionUseCase;
  let createCustomerUseCase: CreateCustomerUseCase;
  let createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase;

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    customerRepository = new InMemoryCustomerRepository();
    subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();

    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );

    createSubscriptionUseCase = new CreateSubscriptionUseCase(
      subscriptionRepository,
      customerRepository,
      subscriptionPlanRepository,
    );

    updateSubscriptionUseCase = new UpdateSubscriptionUseCase(
      subscriptionRepository,
    );
  });

  it('should update the status of an existing subscription', async () => {
    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-123',
      defaultAddressId: 'address-123',
    });

    const { subscriptionPlan } = await createSubscriptionPlanUseCase.execute({
      creatorId: 'creator-456',
      name: 'Basic Plan',
      price: 999,
      currency: 'BRL',
      billingInterval: 'MONTHLY',
      description: null,
      trialDays: null,
      features: ['Feature 1', 'Feature 2'],
    });

    const { subscription } = await createSubscriptionUseCase.execute({
      customerId: customer.id,
      planId: subscriptionPlan.id,
    });

    const updated = await updateSubscriptionUseCase.execute(subscription.id, {
      status: 'ACTIVE',
    });

    expect(updated.subscription.status.value).toBe('ACTIVE');

    const persisted = await subscriptionRepository.findById(subscription.id);
    expect(persisted?.status.value).toBe('ACTIVE');
  });

  it('should update endDate and renewalAt', async () => {
    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-456',
      defaultAddressId: 'address-456',
    });

    const { subscriptionPlan } = await createSubscriptionPlanUseCase.execute({
      creatorId: 'creator-789',
      name: 'Premium Plan',
      price: 1999,
      currency: 'BRL',
      billingInterval: 'MONTHLY',
      description: null,
      trialDays: null,
      features: ['Feature A', 'Feature B'],
    });

    const { subscription } = await createSubscriptionUseCase.execute({
      customerId: customer.id,
      planId: subscriptionPlan.id,
    });

    const newEndDate = new Date('2025-12-31');
    const newRenewalAt = new Date('2025-11-30');

    const updated = await updateSubscriptionUseCase.execute(subscription.id, {
      endDate: newEndDate,
      renewalAt: newRenewalAt,
    });

    expect(updated.subscription.endDate).toEqual(newEndDate);
    expect(updated.subscription.renewalAt).toEqual(newRenewalAt);

    const persisted = await subscriptionRepository.findById(subscription.id);
    expect(persisted?.endDate).toEqual(newEndDate);
    expect(persisted?.renewalAt).toEqual(newRenewalAt);
  });

  it('should throw if subscription does not exist', async () => {
    await expect(
      updateSubscriptionUseCase.execute('invalid-id', {
        status: 'CANCELLED',
      }),
    ).rejects.toThrow('Assinatura não encontrada.');
  });
});
