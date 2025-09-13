import { PayoutCurrencyVO } from '@core/payout/value-objects/payout-currency.vo';

describe('Currency', () => {
  it('deve criar uma moeda válida (BRL)', () => {
    const currency = new PayoutCurrencyVO('BRL');
    expect(currency.value).toBe('BRL');
  });

  it('deve normalizar para uppercase', () => {
    const currency = new PayoutCurrencyVO('usd');
    expect(currency.value).toBe('USD');
  });

  it('deve lançar erro para código inválido', () => {
    expect(() => new PayoutCurrencyVO('xyz')).toThrow(
      'Currency must be a 3-letter ISO code',
    );
  });
});
