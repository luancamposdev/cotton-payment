import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';

describe('ExpMonthVO', () => {
  it('deve criar um ExpMonth válido', () => {
    const expMonth = new ExpMonth(5);
    expect(expMonth.value).toBe(5);
  });

  it('deve permitir criar ExpMonth com valor mínimo (1)', () => {
    const expMonth = new ExpMonth(1);
    expect(expMonth.value).toBe(1);
  });

  it('deve permitir criar ExpMonth com valor máximo (12)', () => {
    const expMonth = new ExpMonth(12);
    expect(expMonth.value).toBe(12);
  });

  it('deve lançar erro se valor for menor que 1', () => {
    expect(() => new ExpMonth(0)).toThrow(
      ' mês de expiração (ExpMonth) deve estar entre 1 e 12.',
    );
  });

  it('deve lançar erro se valor for maior que 12', () => {
    expect(() => new ExpMonth(13)).toThrow(
      'mês de expiração (ExpMonth) deve estar entre 1 e 12.',
    );
  });

  it('deve lançar erro se valor for negativo', () => {
    expect(() => new ExpMonth(-5)).toThrow(
      'mês de expiração (ExpMonth) deve estar entre 1 e 12.',
    );
  });
});
