import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { FindSubscriptionPlanUseCase } from '@application/subscription-pan/find-subscription-plan.use-case';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

describe('FindSubscriptionPlanUseCase', () => {
  it('should find a subscription plan by id', async () => {
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    const findSubscriptionPlanUseCase = new FindSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );

    const plan = new SubscriptionPlanEntity({
      creatorId: 'creator-123',
      name: new SubscriptionNameVo('Basic Plan'),
      description: 'Basic plan description',
      price: new PriceVO(999),
      currency: new CurrencyVO('BRL'),
      billingInterval: new BillingIntervalVO('MONTHLY'),
      trialDays: new TrialDaysVO(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await subscriptionPlanRepository.create(plan);

    const { subscriptionPlan } = await findSubscriptionPlanUseCase.execute({
      id: plan.id,
    });

    expect(subscriptionPlan).toBeInstanceOf(SubscriptionPlanEntity);
    expect(subscriptionPlan.id).toBe(plan.id);
    expect(subscriptionPlan.name.value).toBe('Basic Plan');
  });

  it('should throw NotFoundException if plan does not exist', async () => {
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    const findSubscriptionPlanUseCase = new FindSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );

    await expect(
      findSubscriptionPlanUseCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrow('Subscription plan with id invalid-id not found');
  });
});
