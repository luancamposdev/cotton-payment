import { PaymentStatusVO } from '@core/Order/entities/value-objects/payment-status.vo';

describe('PaymentStatus', () => {
  it('should create a valid status', () => {
    const status = PaymentStatusVO.create('PENDING');

    expect(status).toBeTruthy();
    expect(status.equals(new PaymentStatusVO('PENDING'))).toBe(true);
  });

  it('should normalize status input', () => {
    const status = PaymentStatusVO.create('paid');

    expect(status).toBeTruthy();
    expect(status.equals(new PaymentStatusVO('PAID'))).toBe(true);
  });

  it('should throw error for invalid status', () => {
    expect(() => PaymentStatusVO.create('INVALID')).toThrow(
      'Status de pagamento inválido: INVALID',
    );
  });
});
