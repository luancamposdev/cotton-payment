export class PayoutIdVO {
  constructor(public readonly value: string) {
    if (!value) throw new Error('PayoutId is required');
  }
}
