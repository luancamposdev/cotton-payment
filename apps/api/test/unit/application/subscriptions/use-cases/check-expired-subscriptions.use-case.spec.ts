import { InMemorySubscriptionRepository } from '@test/in-memory-subscription.repository';
import { SubscriptionStatusService } from '@core/subscriptions/services/subscription-status.service';

import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { CheckExpiredSubscriptionsUseCase } from '@application/subscriptions/use-cases/check-expired-subscriptions.use-case.';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';

describe('CheckExpiredSubscriptionsUseCase', () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let useCase: CheckExpiredSubscriptionsUseCase;

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    useCase = new CheckExpiredSubscriptionsUseCase(subscriptionRepository);
  });

  it('should recalculate statuses and save subscriptions', async () => {
    const sub1 = new SubscriptionEntity({
      customerId: 'customer-1',
      status: new SubscriptionStatusVO('ACTIVE'),
      planId: 'plan-1',
      endDate: null,
      renewalAt: null,
      trialEndsAt: null,
    });

    const sub2 = new SubscriptionEntity({
      customerId: 'customer-2',
      status: new SubscriptionStatusVO('TRIAL'),
      planId: 'plan-2',
      endDate: null,
      renewalAt: null,
      trialEndsAt: null,
    });

    await subscriptionRepository.create(sub1);
    await subscriptionRepository.create(sub2);

    const recalcSpy = jest.spyOn(SubscriptionStatusService, 'recalculate');

    await useCase.handle();

    expect(recalcSpy).not.toHaveBeenCalled();

    // Verifica se recalculate foi chamado para cada assinatura
    expect(recalcSpy).toHaveBeenCalledTimes(2);
    expect(recalcSpy).toHaveBeenCalledWith(sub1, expect.any(Date));
    expect(recalcSpy).toHaveBeenCalledWith(sub2, expect.any(Date));

    // Verifica se as assinaturas foram "salvas"
    const savedSub1 = await subscriptionRepository.findById(sub1.id);
    const savedSub2 = await subscriptionRepository.findById(sub2.id);
    expect(savedSub1).toBeDefined();
    expect(savedSub2).toBeDefined();
  });

  it('should do nothing if no active or trial subscriptions exist', async () => {
    // Nenhuma assinatura criada no repositório
    const recalcSpy = jest.spyOn(SubscriptionStatusService, 'recalculate');

    await useCase.handle();

    expect(recalcSpy).not.toHaveBeenCalled();
  });
});
