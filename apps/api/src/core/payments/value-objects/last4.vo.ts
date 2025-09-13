export class Last4 {
  constructor(public readonly value: string) {
    if (!/^\d{4}$/.test(value)) {
      throw new Error(
        'Os últimos 4 dígitos do cartão (Last4) devem conter exatamente 4 números.',
      );
    }
  }
}
