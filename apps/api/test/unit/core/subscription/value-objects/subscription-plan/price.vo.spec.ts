import { PriceVO } from '@core/subscription-plans/value-objects/shared/price.vo';

describe('PriceVO', () => {
  it('should create a valid price', () => {
    const price = new PriceVO(199.99);
    expect(price.value).toBe(199.99);
    expect(price.toString()).toBe('199.99');
  });

  it('should throw error for negative price', () => {
    expect(() => new PriceVO(-1)).toThrow();
  });

  it('should throw error for price exceeding max limit', () => {
    expect(() => new PriceVO(1_000_001)).toThrow();
  });

  it('should compare equality correctly', () => {
    const a = new PriceVO(100);
    const b = new PriceVO(100);
    const c = new PriceVO(200);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
