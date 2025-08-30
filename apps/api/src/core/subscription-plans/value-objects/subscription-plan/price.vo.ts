export class PriceVO {
  private readonly _price: number;

  private static readonly MAX_PRICE = 1_000_000;

  private static validatePrice(price: number): number {
    if (isNaN(price)) {
      throw new Error('Price must be a valid number.');
    }

    if (price < 0) {
      throw new Error('Price must be greater than or equal to 0.');
    }

    if (price > PriceVO.MAX_PRICE) {
      throw new Error(
        `Price exceeds the maximum allowed value of ${PriceVO.MAX_PRICE}.`,
      );
    }

    return Number(price.toFixed(2));
  }

  static fromString(price: string): PriceVO {
    return new PriceVO(parseFloat(price));
  }

  get value(): number {
    return this._price;
  }

  toString(): string {
    return this._price.toFixed(2);
  }

  equals(other: PriceVO): boolean {
    return this.value === other.value;
  }

  constructor(public readonly price: number) {
    this._price = PriceVO.validatePrice(price);
  }
}
