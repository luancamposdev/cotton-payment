export class PostalCodeVo {
  private readonly value: string;

  constructor(value: string) {
    this.value = PostalCodeVo.validateValue(value);
  }

  static validateValue(value: string) {
    if (!/^\d{5}-?\d{3}$/.test(value)) {
      throw new Error(
        'Invalid postal code format. Expected format: 12345-678 or 12345678',
      );
    }

    return value.replace('-', '');
  }

  get getValue(): string {
    return this.value;
  }

  get formatted(): string {
    return `${this.value.substring(0, 5)}-${this.value.substring(5)}`;
  }
}
