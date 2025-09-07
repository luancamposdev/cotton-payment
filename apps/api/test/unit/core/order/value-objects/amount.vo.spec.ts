import { AmountVO } from '@core/Order/value-objects/amount.vo';

describe('AmountVO', () => {
  it('Should be able to create a valid amount', () => {
    const amount = new AmountVO(1000);

    expect(amount).toBeTruthy();
    expect(amount.value).toBe(1000);
    expect(amount.toString()).toBe('10');
  });
});
