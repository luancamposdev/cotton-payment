export class CustomerId {
  constructor(public readonly value: string) {
    if (!value)
      throw new Error('O identificador do cliente (CustomerId) é obrigatório.');
  }
}
