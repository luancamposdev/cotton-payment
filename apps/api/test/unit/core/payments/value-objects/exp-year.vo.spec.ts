import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

describe('ExpYear', () => {
  const currentYear = new Date().getFullYear();

  it('deve criar um ExpYear válido para o ano atual', () => {
    const expYear = new ExpYear(currentYear);
    expect(expYear.value).toBe(currentYear);
  });

  it('deve criar um ExpYear válido para um ano futuro', () => {
    const futureYear = currentYear + 5;
    const expYear = new ExpYear(futureYear);
    expect(expYear.value).toBe(futureYear);
  });

  it('deve lançar erro se o ano for menor que o atual', () => {
    const pastYear = currentYear - 1;
    expect(() => new ExpYear(pastYear)).toThrow(
      'O ano de expiração (ExpYear) deve ser igual ou maior que o ano atual.',
    );
  });
});
