import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';

describe('ProviderToken', () => {
  it('deve criar um ProviderToken válido', () => {
    const token = new ProviderToken('abcdefghij');
    expect(token.value).toBe('abcdefghij');
  });

  it('deve aceitar tokens maiores que 10 caracteres', () => {
    const token = new ProviderToken('abcdefghijklmnop');
    expect(token.value).toBe('abcdefghijklmnop');
  });

  it('deve lançar erro se o token for vazio', () => {
    expect(() => new ProviderToken('')).toThrow('Provider token is invalid');
  });

  it('deve lançar erro se o token tiver menos de 10 caracteres', () => {
    expect(() => new ProviderToken('short')).toThrow(
      'Provider token is invalid',
    );
  });
});
