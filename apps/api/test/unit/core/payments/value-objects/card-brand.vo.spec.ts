import { CardBrand } from '@core/payments/value-objects/card-brand.vo';

describe('CardBrandVO', () => {
  it('deve criar uma bandeira válida', () => {
    const brand = CardBrand.create('Visa');
    expect(brand.value).toBe('Visa');
  });

  it('deve normalizar a entrada ignorando maiúsculas/minúsculas e espaços', () => {
    const brand = CardBrand.create('   vIsA   ');
    expect(brand.value).toBe('Visa');
  });

  it('deve lançar erro se valor for vazio', () => {
    expect(() => CardBrand.create('')).toThrowError(
      'A bandeira do cartão é obrigatória.',
    );
  });

  it('deve lançar erro se bandeira não for suportada', () => {
    expect(() => CardBrand.create('CartãoXPTO')).toThrowError(
      'Bandeira do cartão inválida: CartãoXPTO.',
    );
  });

  it('deve listar todas as bandeiras suportadas', () => {
    const values = CardBrand.values();
    expect(values).toContain('Visa');
    expect(values).toContain('Mastercard');
    expect(values).toContain('Elo');
    expect(values.length).toBeGreaterThan(5);
  });

  it('deve comparar corretamente duas bandeiras iguais', () => {
    const a = CardBrand.create('Visa');
    const b = CardBrand.create('visa');
    expect(a.equals(b)).toBe(true);
  });

  it('deve comparar corretamente duas bandeiras diferentes', () => {
    const a = CardBrand.create('Visa');
    const b = CardBrand.create('Mastercard');
    expect(a.equals(b)).toBe(false);
  });
});
