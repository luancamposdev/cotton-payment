export class ProviderPayoutIdVO {
  constructor(public readonly value: string) {
    if (!value) throw new Error('ProviderPayoutId is required');
  }
}
