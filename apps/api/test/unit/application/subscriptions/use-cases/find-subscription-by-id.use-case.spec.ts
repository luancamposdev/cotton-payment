import { NotFoundException } from '@nestjs/common';
import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';
import { FindSubscriptionByIdUseCase } from '@application/subscriptions/use-cases/find-subscription-by-id.use-case';

describe('FindSubscriptionByIdUseCase', () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let useCase: FindSubscriptionByIdUseCase;

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    useCase = new FindSubscriptionByIdUseCase(subscriptionRepository);
  });

  it('should return a subscription by ID', async () => {
    const subscription = new SubscriptionEntity({
      customerId: 'customer-123',
      planId: 'plan-123',
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date(),
      endDate: null,
      renewalAt: null,
      trialEndsAt: null,
    });

    await subscriptionRepository.create(subscription);

    const result = await useCase.execute({ id: subscription.id });

    expect(result.subscription).toBe(subscription);
  });

  it('should throw NotFoundException if subscription does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
