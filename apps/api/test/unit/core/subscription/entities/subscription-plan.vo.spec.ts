import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/shared/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/shared/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

describe('SubscriptionPlanVO', () => {
  it('should create a subscription plan entity with correct values', () => {
    const subscriptionName = new SubscriptionNameVo('Premium Plan');
    const price = new PriceVO(1999);
    const currency = new CurrencyVO('brl');
    const billingInterval = new BillingIntervalVO('MONTHLY');
    const trialDays = new TrialDaysVO(14);

    const subscriptionPlan = new SubscriptionPlanEntity({
      creatorId: 'creator-123',
      name: subscriptionName,
      description: 'Plano premium para conteúdos exclusivos',
      price,
      currency,
      billingInterval,
      trialDays: trialDays,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(subscriptionPlan).toBeDefined();
    expect(subscriptionPlan).toBeTruthy();
    expect(subscriptionPlan.creatorId).toBe('creator-123');
    expect(subscriptionPlan.name.value).toBe('Premium Plan');
    expect(subscriptionPlan.description).toBe(
      'Plano premium para conteúdos exclusivos',
    );
    expect(subscriptionPlan.price.value).toBe(1999);
    expect(subscriptionPlan.currency.value).toBe('BRL');
    expect(subscriptionPlan.billingInterval.value).toBe('MONTHLY');
    expect(subscriptionPlan.trialDays?.value).toBe(14);
  });

  it('should update the plan description', () => {
    const planEntity = new SubscriptionPlanEntity({
      creatorId: 'creator-123',
      name: new SubscriptionNameVo('Premium Plan'),
      description: 'Plano premium para conteúdos exclusivos',
      price: new PriceVO(1999),
      currency: new CurrencyVO('BRL'),
      billingInterval: new BillingIntervalVO('MONTHLY'),
      trialDays: new TrialDaysVO(14),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    planEntity.updatePlan({ description: 'Novo descrição' });
    expect(planEntity.description).toBe('Novo descrição');
    expect(planEntity.updatedAt).toBeInstanceOf(Date);
  });

  it('should update price', () => {
    const planEntity = new SubscriptionPlanEntity({
      creatorId: 'creator-123',
      name: new SubscriptionNameVo('Premium Plan'),
      description: 'Plano premium',
      price: new PriceVO(1999),
      currency: new CurrencyVO('BRL'),
      billingInterval: new BillingIntervalVO('MONTHLY'),
      trialDays: new TrialDaysVO(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newPrice = new PriceVO(2999);
    planEntity.updatePlan({ price: newPrice });
    expect(planEntity.price.value).toBe(2999);
  });

  it('should update billing interval', () => {
    const planEntity = new SubscriptionPlanEntity({
      creatorId: 'creator-123',
      name: new SubscriptionNameVo('Premium Plan'),
      description: 'Plano premium',
      price: new PriceVO(1999),
      currency: new CurrencyVO('BRL'),
      billingInterval: new BillingIntervalVO('MONTHLY'),
      trialDays: new TrialDaysVO(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newInterval = new BillingIntervalVO('YEARLY');
    planEntity.updatePlan({ billingInterval: newInterval });
    expect(planEntity.billingInterval.value).toBe('YEARLY');
  });

  it('should allow null description and trialDays', () => {
    const planEntity = new SubscriptionPlanEntity({
      creatorId: 'creator-456',
      name: new SubscriptionNameVo('Basic Plan'),
      price: new PriceVO(999),
      currency: new CurrencyVO('BRL'),
      billingInterval: new BillingIntervalVO('MONTHLY'),
      description: null,
      trialDays: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(planEntity.description).toBeNull();
    expect(planEntity.trialDays).toBeNull();
  });
});
