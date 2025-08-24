import { PostalCodeVo } from '@core/addresses/value-objects/postal-code.vo';

describe('PostalCode Value Object', () => {
  it('should create a PostalCode with valid value', () => {
    const validPostalCode = '12345678';

    const postalCode = new PostalCodeVo(validPostalCode);

    expect(postalCode).toBeInstanceOf(PostalCodeVo);
    expect(postalCode.getValue).toBe(validPostalCode);
  });

  it('should throw an error when creating a PostalCode with invalid value', () => {
    const invalidPostalCode = '1234';

    expect(() => new PostalCodeVo(invalidPostalCode)).toThrow(
      'Invalid postal code format. Expected format: 12345-678 or 12345678',
    );
  });
});
