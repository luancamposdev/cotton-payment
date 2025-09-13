export class CreatorPayoutConfigIdVO {
  constructor(public readonly value: string) {
    if (!value) throw new Error('CreatorPayoutConfigId is required');
  }
}
