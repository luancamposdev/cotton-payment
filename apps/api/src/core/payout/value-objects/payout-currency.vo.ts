export class PayoutCurrencyVO {
  private static readonly ALLOWED = ['BRL', 'USD', 'EUR'];

  constructor(public readonly value: string) {
    if (!PayoutCurrencyVO.ALLOWED.includes(value.toUpperCase())) {
      throw new Error('Currency must be a 3-letter ISO code');
    }
    this.value = value.toUpperCase();
  }
}
