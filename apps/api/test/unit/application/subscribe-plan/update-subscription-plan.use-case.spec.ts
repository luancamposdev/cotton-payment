import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/create-subscription-plan.use-case';
import { UpdateSubscriptionPlanUseCase } from '@application/subscription-plan/update-subscription-plan.use-case';
import { UpdateSubscriptionPlanDto } from '@/interfaces/subscription-plan/dto/update-subscription-plan.dto';
import { BillingInterval } from '@prisma/client';

describe('SubscriptionPlan Update Use Case', () => {
  const repository = new InMemorySubscriptionPlanRepository();
  const createUseCase = new CreateSubscriptionPlanUseCase(repository);
  const updateUseCase = new UpdateSubscriptionPlanUseCase(repository);

  const defaultFeatures = [
    'Acesso a todos os módulos',
    'Suporte 24/7',
    'Relatórios avançados com BI',
    'Usuários ilimitados',
  ];

  it('should update subscription plan details', async () => {
    const createDTO = {
      creatorId: 'creator-1',
      name: 'Basic Plan',
      description: 'Original description',
      price: 100,
      currency: 'USD',
      billingInterval: 'MONTHLY' as const,
      trialDays: 7,
      features: defaultFeatures,
    };

    const { subscriptionPlan } = await createUseCase.execute(createDTO);

    const updateDTO: UpdateSubscriptionPlanDto = {
      name: 'Pro Plan',
      description: 'Updated description',
      price: 200,
      currency: 'EUR',
      billingInterval: 'YEARLY' as BillingInterval,
      trialDays: 14,
      features: ['Novo recurso 1', 'Novo recurso 2'],
    };

    const { subscriptionPlan: updated } = await updateUseCase.execute(
      subscriptionPlan.id,
      updateDTO,
    );

    expect(updated).toBeTruthy();
    expect(updated.id).toBe(subscriptionPlan.id);
    expect(updated.name.value).toBe('Pro Plan');
    expect(updated.description).toBe('Updated description');
    expect(updated.price.value).toBe(200);
    expect(updated.currency.value).toBe('EUR');
    expect(updated.billingInterval.value).toBe('YEARLY');
    expect(updated.trialDays?.value).toBe(14);
    expect(updated.features.value).toEqual(updateDTO.features);
  });

  it('should throw NotFoundException if subscription plan does not exist', async () => {
    const updateDTO: UpdateSubscriptionPlanDto = {
      description: 'does not matter',
    };

    await expect(
      updateUseCase.execute('non-existent-plan', updateDTO),
    ).rejects.toThrow('Plano não encontrado.');
  });
});
