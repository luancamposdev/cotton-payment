import { Last4 } from '@core/payments/value-objects/last4.vo';

describe('Last4', () => {
  it('deve criar um Last4 válido', () => {
    const last4 = new Last4('1234');
    expect(last4.value).toBe('1234');
  });

  it('deve lançar erro se não tiver exatamente 4 dígitos', () => {
    expect(() => new Last4('123')).toThrow('Last4 must be exactly 4 digits');
    expect(() => new Last4('12345')).toThrow('Last4 must be exactly 4 digits');
  });

  it('deve lançar erro se contiver letras ou caracteres inválidos', () => {
    expect(() => new Last4('12a4')).toThrow('Last4 must be exactly 4 digits');
    expect(() => new Last4('abcd')).toThrow('Last4 must be exactly 4 digits');
  });
});
