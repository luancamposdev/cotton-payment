export class CustomerId {
  constructor(public readonly value: string) {
    if (!value) throw new Error('CustomerId is required');
  }
}
