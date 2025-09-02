import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { FindSubscriptionPlansByCreatorUseCase } from '@application/subscription-plan/find-subscription-plan-by-creator.use-case';

import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

describe('FindPlansByCreatorUseCase', () => {
  it('should return all plans for a given creator', async () => {
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    const findPlansByCreatorUseCase = new FindSubscriptionPlansByCreatorUseCase(
      subscriptionPlanRepository,
    );

    await subscriptionPlanRepository.create(
      new SubscriptionPlanEntity({
        creatorId: 'creator-123',
        name: new SubscriptionNameVo('Plan A'),
        price: new PriceVO(1000),
        currency: new CurrencyVO('BRL'),
        billingInterval: new BillingIntervalVO('MONTHLY'),
        description: 'Plan A description',
        trialDays: new TrialDaysVO(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await subscriptionPlanRepository.create(
      new SubscriptionPlanEntity({
        creatorId: 'creator-123',
        name: new SubscriptionNameVo('Plan B'),
        price: new PriceVO(2000),
        currency: new CurrencyVO('BRL'),
        billingInterval: new BillingIntervalVO('MONTHLY'),
        description: 'Plan B description',
        trialDays: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const result = await findPlansByCreatorUseCase.execute({
      creatorId: 'creator-123',
    });

    console.log(result);

    expect(result.subscriptionPlans).toHaveLength(2);
    expect(result.subscriptionPlans[0]).toBeInstanceOf(SubscriptionPlanEntity);
    expect(result.subscriptionPlans[1]).toBeInstanceOf(SubscriptionPlanEntity);
  });

  it('should throw NotFoundException if no plans found', async () => {
    const subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    const findPlansByCreatorUseCase = new FindSubscriptionPlansByCreatorUseCase(
      subscriptionPlanRepository,
    );

    await expect(
      findPlansByCreatorUseCase.execute({ creatorId: 'non-existent-creator' }),
    ).rejects.toThrow(
      'No subscription plans found for creator non-existent-creator',
    );
  });
});
