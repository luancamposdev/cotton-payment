export class CurrencyVO {
  private readonly _currency: string;

  private static readonly allowedCurrencies = ['USD', 'EUR', 'BRL'];

  private static validateCurrency(currency: string): string {
    if (!currency) {
      throw new Error('Currency is required.');
    }

    const upper = currency.toUpperCase();

    if (!CurrencyVO.allowedCurrencies.includes(upper)) {
      throw new Error(
        `Invalid currency. Allowed values are: ${CurrencyVO.allowedCurrencies.join(', ')}.`,
      );
    }
    return upper;
  }

  constructor(currency: string) {
    this._currency = CurrencyVO.validateCurrency(currency);
  }

  get value(): string {
    return this._currency;
  }

  equals(other: CurrencyVO): boolean {
    return this._currency === other.value;
  }

  toString(): string {
    return this._currency;
  }
}
