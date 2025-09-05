export class ExpYear {
  constructor(public readonly value: number) {
    const currentYear = new Date().getFullYear();
    if (value < currentYear)
      throw new Error('ExpYear must be current or future year');
  }
}
