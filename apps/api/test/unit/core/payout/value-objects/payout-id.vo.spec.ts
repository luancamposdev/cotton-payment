import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';

describe('PayoutIdVO', () => {
  it('should create a valid payout id', () => {
    const id = new PayoutIdVO('payout-123');

    expect(id).toBeTruthy();
    expect(id.value).toBe('payout-123');
  });
});
