export class Last4 {
  constructor(public readonly value: string) {
    if (!/^\d{4}$/.test(value)) {
      throw new Error('Last4 must be exactly 4 digits');
    }
  }
}
