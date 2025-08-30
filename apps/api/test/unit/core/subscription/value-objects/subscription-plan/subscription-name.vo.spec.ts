import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';

describe('SubscriptionNameVO', () => {
  it('Should be able to create a valid subscription name', () => {
    const name = new SubscriptionNameVo('Pro Plano');

    expect(name).toBeTruthy();
    expect(name.value).toBe('Pro Plano');
    expect(name.toString()).toBe('Pro Plano');
  });

  it('should trim the name', () => {
    const name = new SubscriptionNameVo('  Pro Plano  ');

    expect(name.value).toBe('Pro Plano');
  });

  it('should throw error if name is too short', () => {
    expect(() => new SubscriptionNameVo('A')).toThrow();
  });

  it('should throw error if name is too long', () => {
    const longName = 'A'.repeat(101);
    expect(() => new SubscriptionNameVo(longName)).toThrow();
  });

  it('should compare equality correctly', () => {
    const a = new SubscriptionNameVo('Premium');
    const b = new SubscriptionNameVo('Premium');
    const c = new SubscriptionNameVo('Basic');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
