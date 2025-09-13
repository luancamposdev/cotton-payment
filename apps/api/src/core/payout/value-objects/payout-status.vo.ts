export type PayoutStatusType = (typeof PayoutStatusVO.ALLOWED_STATUSES)[number];

export class PayoutStatusVO {
  public static readonly ALLOWED_STATUSES = [
    'PENDING',
    'SCHEDULED',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
  ] as const;

  public static create(value: string): PayoutStatusVO {
    const upper = value.trim().toUpperCase();

    if (!PayoutStatusVO.ALLOWED_STATUSES.includes(upper as PayoutStatusType)) {
      throw new Error(`Invalid payout status: ${value}`);
    }

    return new PayoutStatusVO(upper as PayoutStatusType);
  }

  public equals(other: PayoutStatusVO): boolean {
    return this.value === other.value;
  }

  constructor(public readonly value: PayoutStatusType) {
    if (!PayoutStatusVO.ALLOWED_STATUSES.includes(value)) {
      throw new Error(`Invalid payout status: ${value}`);
    }
  }
}
