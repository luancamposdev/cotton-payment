import { ProviderPayoutIdVO } from '@core/payout/value-objects/provider-payout-id.vo';

describe('ProviderPayoutId', () => {
  it('deve aceitar string válida', () => {
    const id = new ProviderPayoutIdVO('prov-12345');
    expect(id.value).toBe('prov-12345');
  });

  it('deve lançar erro se for vazio', () => {
    expect(() => new ProviderPayoutIdVO('')).toThrow(
      'ProviderPayoutId is required',
    );
  });
});
