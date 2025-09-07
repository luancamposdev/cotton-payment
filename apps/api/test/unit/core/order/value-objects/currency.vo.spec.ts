import { CurrencyVO } from '@core/Order/value-objects/currency.vo';

describe('CurrencyVO', () => {
  it('should create a valid currency', () => {
    const currency = new CurrencyVO('BRL');

    expect(currency).toBeTruthy();
    expect(currency.value).toBe('BRL');
  });
});
