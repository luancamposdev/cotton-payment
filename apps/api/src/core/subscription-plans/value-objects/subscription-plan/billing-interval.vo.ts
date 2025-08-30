export type BillingIntervalType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export class BillingIntervalVO {
  private readonly _billingInterval: BillingIntervalType;

  private static readonly allowedIntervals: BillingIntervalType[] = [
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY',
  ];

  private static validateInterval(value: BillingIntervalType): void {
    if (!value) {
      throw new Error('Billing interval is required.');
    }

    if (!BillingIntervalVO.allowedIntervals.includes(value)) {
      throw new Error(
        `Invalid billing interval. Allowed values: ${BillingIntervalVO.allowedIntervals.join(
          ', ',
        )}.`,
      );
    }
  }

  get value(): BillingIntervalType {
    return this._billingInterval;
  }

  toString(): string {
    return this._billingInterval;
  }

  equals(other: BillingIntervalVO): boolean {
    return this._billingInterval === other.value;
  }

  isMonthly(): boolean {
    return this._billingInterval === 'MONTHLY';
  }

  isYearly(): boolean {
    return this._billingInterval === 'YEARLY';
  }

  constructor(value: BillingIntervalType) {
    BillingIntervalVO.validateInterval(value);
    this._billingInterval = value;
  }
}
