import { CountryVo } from '@core/address/value-objects/country.vo';

describe('Country', () => {
  it('Should be able to create a country with a valid 2-letter ISO code', () => {
    const country = new CountryVo('BR');

    expect(country).toBeTruthy();
    expect(country).toBeDefined();
  });

  it('Should throw an error if the country code is not 2 letters', () => {
    expect(() => new CountryVo('BRA')).toThrow(
      'Country must be a 2-letter ISO 3166-1 alpha-2 code.',
    );
  });
});
