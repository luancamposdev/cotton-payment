export type CurrencyType = (typeof CurrencyVO.ALLOWED_CURRENCIES)[number];

export class CurrencyVO {
  public static readonly ALLOWED_CURRENCIES = ['BRL', 'USD', 'EUR'] as const;

  private readonly _currency: CurrencyType;

  public static create(currency: string): CurrencyVO {
    if (!currency) {
      throw new Error('Moeda é obrigatório');
    }

    const normalized = CurrencyVO.normalize(currency);

    if (!CurrencyVO.ALLOWED_CURRENCIES.includes(normalized)) {
      throw new Error(`Moeda Inválida: "${currency}"`);
    }

    return new CurrencyVO(normalized);
  }

  public static values(): readonly CurrencyType[] {
    return this.ALLOWED_CURRENCIES;
  }

  public get value(): string {
    return this._currency;
  }

  public equals(currency: CurrencyVO): boolean {
    return this._currency === currency._currency;
  }

  private static normalize(currency: string): CurrencyType {
    const formatted = currency.trim().toUpperCase();
    const found = CurrencyVO.ALLOWED_CURRENCIES.find(
      (c) => c.toUpperCase() === formatted,
    );

    if (!found) {
      throw new Error(`Moeda Inválida: ${currency}`);
    }

    return found;
  }

  constructor(currency: CurrencyType) {
    this._currency = currency;
  }
}
