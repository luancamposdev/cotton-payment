import { CancelSubscriptionUseCase } from '@application/subscriptions/cancel-subscription.use-case';
import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/create-subscription-plan.use-case';

describe('CancelSubscriptionUseCase', () => {
  it('should cancel an existing subscription', async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository();
    const customerRepository = new InMemoryCustomerRepository();
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();

    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );
    const createSubscriptionUseCase = new CreateSubscriptionUseCase(
      subscriptionRepository,
      customerRepository,
      subscriptionPlanRepository,
    );
    const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(
      subscriptionRepository,
    );

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

    const canceled = await cancelSubscriptionUseCase.execute(subscription.id);

    expect(canceled.subscription.status.value).toBe('CANCELLED');
    expect(canceled.subscription.endDate).toBeInstanceOf(Date);

    const persisted = await subscriptionRepository.findById(subscription.id);

    expect(persisted?.status.value).toBe('CANCELLED');
    expect(persisted?.endDate).toBeInstanceOf(Date);
  });

  it('should throw if subscription does not exist', async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository();
    const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(
      subscriptionRepository,
    );

    await expect(
      cancelSubscriptionUseCase.execute('non-existent-id'),
    ).rejects.toThrow('Assinatura não encontrada.');
  });
});
