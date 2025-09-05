import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';
import { FindSubscriptionByCustomerUseCase } from '@application/subscriptions/use-cases/find-subscription-by-customer.use-case';

describe('FindSubscriptionByCustomerUseCase', () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let useCase: FindSubscriptionByCustomerUseCase;

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    useCase = new FindSubscriptionByCustomerUseCase(subscriptionRepository);
  });

  it('should return all subscriptions for a given customer', async () => {
    const customerId = 'customer-123';

    const sub1 = new SubscriptionEntity({
      customerId,
      status: new SubscriptionStatusVO('ACTIVE'),
      planId: 'plan-1',
      endDate: null,
      renewalAt: null,
      trialEndsAt: null,
    });

    const sub2 = new SubscriptionEntity({
      customerId,
      status: new SubscriptionStatusVO('TRIAL'),
      planId: 'plan-2',
      endDate: null,
      renewalAt: null,
      trialEndsAt: null,
    });

    await subscriptionRepository.create(sub1);
    await subscriptionRepository.create(sub2);

    const result = await useCase.execute({ customerId });

    expect(result.subscriptions).toHaveLength(2);
    expect(result.subscriptions.map((s) => s.id)).toEqual(
      expect.arrayContaining([sub1.id, sub2.id]),
    );
  });

  it('should throw NotFoundException if no subscriptions exist for the customer', async () => {
    const customerId = 'non-existent-customer';

    await expect(useCase.execute({ customerId })).rejects.toThrow(
      'Nenhum plano encontrado para este criador.',
    );
  });
});
