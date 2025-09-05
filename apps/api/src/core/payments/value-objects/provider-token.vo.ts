export class ProviderToken {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.length < 10) {
      throw new Error('Provider token is invalid');
    }
    this.value = value;
  }
}
