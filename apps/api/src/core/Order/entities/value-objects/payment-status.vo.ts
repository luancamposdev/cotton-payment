export type PaymentStatusType =
  (typeof PaymentStatusVO.ALLOWED_STATUSES)[number];

export class PaymentStatusVO {
  public static readonly ALLOWED_STATUSES = [
    'PENDING',
    'PAID',
    'FAILED',
    'CANCELLED',
  ] as const;

  public readonly _paymentStatus: PaymentStatusType;

  public static create(paymentStatus: string): PaymentStatusVO {
    if (!paymentStatus) {
      throw new Error('PaymentStatus is required');
    }

    const normalized = PaymentStatusVO.normalize(paymentStatus);

    if (!PaymentStatusVO.ALLOWED_STATUSES.includes(normalized)) {
      throw new Error(`Status de pagamento inválido: "${paymentStatus}"`);
    }

    return new PaymentStatusVO(normalized);
  }

  private static normalize(value: string): PaymentStatusType {
    const formatted = value.trim().toUpperCase();
    const found = PaymentStatusVO.ALLOWED_STATUSES.find(
      (status) => status.toUpperCase() === formatted,
    );

    if (!found) {
      throw new Error(`Status de pagamento inválido: ${value}`);
    }

    return found;
  }

  public static values(): readonly PaymentStatusType[] {
    return this.ALLOWED_STATUSES;
  }

  public equals(paymentStatus: PaymentStatusVO): boolean {
    return this._paymentStatus === paymentStatus._paymentStatus;
  }

  constructor(paymentStatus: PaymentStatusType) {
    this._paymentStatus = paymentStatus;
  }
}
