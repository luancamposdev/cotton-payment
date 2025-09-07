export class AmountVO {
  public readonly _amount: number;

  public static create(cents: number): AmountVO {
    return new AmountVO(cents);
  }

  public equals(cents: AmountVO): boolean {
    return this._amount === cents._amount;
  }

  public toString(): string {
    return `${this._amount / 100}`;
  }

  constructor(cents: number) {
    if (cents < 0) throw new Error('O valor não pode ser negativo.');

    this._amount = cents;
  }
}
