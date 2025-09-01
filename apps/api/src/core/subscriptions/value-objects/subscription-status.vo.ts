export class SubscriptionStatusVO {
  private readonly _subscriptionStatus: string;

  private static readonly allowedStatuses = [
    'ACTIVE',
    'PENDING',
    'CANCELLED',
    'EXPIRED',
    'TRIAL',
  ];

  private static validateStatus(status: string): string {
    if (!status) {
      throw new Error('status is required.');
    }

    const upper = status.toUpperCase();

    if (!SubscriptionStatusVO.allowedStatuses.includes(upper)) {
      throw new Error(
        `Invalid subscription status. Allowed values are: ${SubscriptionStatusVO.allowedStatuses.join(', ')}.`,
      );
    }

    return upper;
  }

  get value(): string {
    return this._subscriptionStatus;
  }

  toString(): string {
    return this._subscriptionStatus;
  }

  equals(other: SubscriptionStatusVO): boolean {
    return this._subscriptionStatus === other.value;
  }

  constructor(status: string) {
    this._subscriptionStatus = SubscriptionStatusVO.validateStatus(status);
  }
}
