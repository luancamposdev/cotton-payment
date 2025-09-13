import { Last4 } from '@core/payments/value-objects/last4.vo';

describe('Last4', () => {
  it('deve criar um Last4 válido', () => {
    const last4 = new Last4('1234');
    expect(last4.value).toBe('1234');
  });

  it('deve lançar erro se não tiver exatamente 4 dígitos', () => {
    expect(() => new Last4('123')).toThrow(
      'Os últimos 4 dígitos do cartão (Last4) devem conter exatamente 4 números.',
    );
    expect(() => new Last4('12345')).toThrow(
      'Os últimos 4 dígitos do cartão (Last4) devem conter exatamente 4 números.',
    );
  });

  it('deve lançar erro se contiver letras ou caracteres inválidos', () => {
    expect(() => new Last4('12a4')).toThrow(
      'Os últimos 4 dígitos do cartão (Last4) devem conter exatamente 4 números.',
    );
    expect(() => new Last4('abcd')).toThrow(
      'Os últimos 4 dígitos do cartão (Last4) devem conter exatamente 4 números.',
    );
  });
});
