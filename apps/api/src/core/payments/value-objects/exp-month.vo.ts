export class ExpMonth {
  constructor(public readonly value: number) {
    if (value < 1 || value > 12)
      throw new Error('ExpMonth must be between 1 and 12');
  }
}
