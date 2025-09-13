export class ProviderToken {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.length < 10) {
      throw new Error('O token do provedor (ProviderToken) é inválido.');
    }
    this.value = value;
  }
}
