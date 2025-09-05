import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/create-subscription-plan.use-case';

describe('CreateSubscriptionPlanUseCase', () => {
  it('should create a subscription plan successfully', async () => {
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );

    const request = {
      creatorId: 'user-123',
      name: 'Basic Plan',
      description: 'Plano básico de teste',
      price: 1999,
      currency: 'BRL',
      billingInterval: 'MONTHLY' as const,
      trialDays: 7,
      features: [
        'Acesso a todos os módulos',
        'Suporte 24/7',
        'Relatórios avançados com BI',
        'Usuários ilimitados',
      ],
    };

    const { subscriptionPlan } =
      await createSubscriptionPlanUseCase.execute(request);

    expect(subscriptionPlan).toBeInstanceOf(SubscriptionPlanEntity);
    expect(subscriptionPlan.creatorId).toBe(request.creatorId);
    expect(subscriptionPlan.name.toString()).toBe(request.name);
    expect(subscriptionPlan.description).toBe(request.description);
    expect(subscriptionPlan.price.value).toBe(request.price);
    expect(subscriptionPlan.currency.value).toBe(request.currency);
    expect(subscriptionPlan.billingInterval.value).toBe(
      request.billingInterval,
    );
    expect(subscriptionPlan.trialDays?.value).toBe(request.trialDays);
    expect(subscriptionPlan.features.value).toEqual(request.features);

    const persisted = await subscriptionPlanRepository.findById(
      subscriptionPlan.id,
    );
    expect(persisted).not.toBeNull();
    expect(persisted?.id).toBe(subscriptionPlan.id);
  });

  it('should create a plan without optional fields', async () => {
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );

    const request = {
      creatorId: 'user-456',
      name: 'Pro Plan',
      description: null,
      price: 4999,
      currency: 'BRL',
      billingInterval: 'YEARLY' as const,
      trialDays: null,
      features: [
        'Acesso a todos os módulos',
        'Suporte 24/7',
        'Relatórios avançados com BI',
        'Usuários ilimitados',
      ],
    };

    const result = await createSubscriptionPlanUseCase.execute(request);

    expect(result.subscriptionPlan).toBeInstanceOf(SubscriptionPlanEntity);
    expect(result.subscriptionPlan.description).toBeNull();
    expect(result.subscriptionPlan.trialDays).toBeNull();
    expect(result.subscriptionPlan.features.value).toEqual(request.features);
  });
});
