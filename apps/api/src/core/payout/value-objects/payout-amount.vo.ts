export class PayoutAmountVO {
  constructor(public readonly value: number) {
    if (value <= 0) throw new Error('Payout amount must be greater than 0');
  }
}
