import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';

describe('CurrencyVO', () => {
  it('should create a valid currency', () => {
    const currency = new CurrencyVO('BRL');
    expect(currency.value).toBe('BRL');
    expect(currency.toString()).toBe('BRL');
  });

  it('should throw error for invalid currency', () => {
    expect(() => new CurrencyVO('JPY')).toThrow();
  });

  it('should throw error if empty', () => {
    expect(() => new CurrencyVO('')).toThrow();
  });

  it('should compare equality correctly', () => {
    const a = new CurrencyVO('USD');
    const b = new CurrencyVO('USD');
    const c = new CurrencyVO('EUR');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
