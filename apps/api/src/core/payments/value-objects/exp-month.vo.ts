export class ExpMonth {
  constructor(public readonly value: number) {
    if (value < 1 || value > 12)
      throw new Error('O mês de expiração (ExpMonth) deve estar entre 1 e 12.');
  }
}
