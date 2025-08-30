import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';

describe('BillingIntervalVO', () => {
  it('should create a valid interval', () => {
    const interval = new BillingIntervalVO('MONTHLY');
    expect(interval.value).toBe('MONTHLY');
    expect(interval.toString()).toBe('MONTHLY');
    expect(interval.isMonthly()).toBe(true);
    expect(interval.isYearly()).toBe(false);
  });

  it('should throw error if interval is empty', () => {
    // @ts-expect-error Testing invalid empty string input
    expect(() => new BillingIntervalVO('')).toThrow();
  });

  it('should compare equality correctly', () => {
    const a = new BillingIntervalVO('YEARLY');
    const b = new BillingIntervalVO('YEARLY');
    const c = new BillingIntervalVO('MONTHLY');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
