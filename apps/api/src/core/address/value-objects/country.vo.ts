export class CountryVo {
  private readonly value: string;

  constructor(value: string) {
    this.value = CountryVo.validateValue(value);
  }

  static validateValue(value: string) {
    if (value.length !== 2) {
      throw new Error('Country must be a 2-letter ISO 3166-1 alpha-2 code.');
    }

    return value.replace('-', '');
  }
}
