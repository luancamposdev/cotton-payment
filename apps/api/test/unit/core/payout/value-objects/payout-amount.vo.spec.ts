import { PayoutAmountVO } from '@core/payout/value-objects/payout-amount.vo';

describe('AmountCents', () => {
  it('deve criar um AmountCents válido', () => {
    const amount = new PayoutAmountVO(1000);
    expect(amount.value).toBe(1000);
  });

  it('deve lançar erro se for negativo', () => {
    expect(() => new PayoutAmountVO(-10)).toThrow(
      'Payout amount must be greater than 0',
    );
  });
});
