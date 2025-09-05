import { SubscriptionStatusService } from '@core/subscriptions/services/subscription-status.service';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';
import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { FeaturesVO } from '@core/subscription-plans/value-objects/subscription-plan/features.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

describe('SubscriptionStatusService', () => {
  const makePlan = (trialDays: number | null = null) =>
    new SubscriptionPlanEntity(
      {
        name: new SubscriptionNameVo('Plano Teste'),
        description: 'desc',
        price: new PriceVO(100),
        currency: new CurrencyVO('BRL'),
        billingInterval: new BillingIntervalVO('MONTHLY'),
        trialDays: trialDays !== null ? new TrialDaysVO(trialDays) : null,
        features: new FeaturesVO([]),
        creatorId: 'creator-1',
      },
      'plan-1',
    );

  it('mantém CANCELLED sem alteração', () => {
    const plan = makePlan();
    const sub = new SubscriptionEntity({
      customerId: 'c1',
      planId: plan.id,
      status: new SubscriptionStatusVO('CANCELLED'),
      startDate: new Date(),
      trialEndsAt: null,
      endDate: null,
      renewalAt: null,
    });

    const result = SubscriptionStatusService.recalculate(sub);
    expect(result.status.value).toBe('CANCELLED');
  });

  it('marca como TRIAL se ainda dentro do período de trial', () => {
    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const sub = new SubscriptionEntity({
      customerId: 'c1',
      planId: 'plan-1',
      status: new SubscriptionStatusVO('PENDING'),
      startDate: now,
      trialEndsAt,
      endDate: null,
      renewalAt: null,
    });

    const result = SubscriptionStatusService.recalculate(sub, now);

    expect(result.status.value).toBe('TRIAL');
  });

  it('marca como EXPIRED se passou do endDate', () => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() - 1);

    const sub = new SubscriptionEntity({
      customerId: 'c1',
      planId: 'plan-1',
      status: new SubscriptionStatusVO('ACTIVE'),
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      trialEndsAt: null,
      endDate,
      renewalAt: null,
    });

    const result = SubscriptionStatusService.recalculate(sub, now);
    expect(result.status.value).toBe('EXPIRED');
  });

  it('marca como ACTIVE se sem trial e dentro do período válido', () => {
    const now = new Date();

    const sub = new SubscriptionEntity({
      customerId: 'c1',
      planId: 'plan-1',
      status: new SubscriptionStatusVO('PENDING'),
      startDate: new Date(now.getTime() - 1000 * 60),
      trialEndsAt: null,
      endDate: null,
      renewalAt: null,
    });

    const result = SubscriptionStatusService.recalculate(sub, now);
    expect(result.status.value).toBe('ACTIVE');
  });
});
