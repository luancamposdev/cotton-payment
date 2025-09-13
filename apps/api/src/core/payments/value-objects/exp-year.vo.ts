export class ExpYear {
  constructor(public readonly value: number) {
    const currentYear = new Date().getFullYear();
    if (value < currentYear)
      throw new Error(
        'O ano de expiração (ExpYear) deve ser igual ou maior que o ano atual.',
      );
  }
}
