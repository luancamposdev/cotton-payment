export class CardBrand {
  constructor(public readonly value: string) {
    if (!value) throw new Error('Card brand is required');
  }
}
