export type CardBrandType = (typeof CardBrand.ALLOWED_BRANDS)[number];

export class CardBrand {
  public static readonly ALLOWED_BRANDS = [
    'Visa',
    'Mastercard',
    'Elo',
    'American Express',
    'Hipercard',
    'Diners Club',
    'Discover',
    'JCB',
    'Aura',
  ] as const;

  public readonly value: CardBrandType;

  constructor(value: CardBrandType) {
    this.value = value;
  }

  /**
   * Cria um CardBrand válido a partir de string.
   */
  public static create(value: string): CardBrand {
    if (!value) {
      throw new Error('A bandeira do cartão é obrigatória.');
    }

    const normalized = CardBrand.normalize(value);

    if (!CardBrand.ALLOWED_BRANDS.includes(normalized)) {
      throw new Error(`Bandeira do cartão inválida: "${value}".`);
    }

    return new CardBrand(normalized);
  }

  /**
   * Lista todas as bandeiras suportadas.
   */
  public static values(): readonly CardBrandType[] {
    return this.ALLOWED_BRANDS;
  }

  /**
   * Compara dois CardBrand.
   */
  public equals(other: CardBrand): boolean {
    return this.value === other.value;
  }

  /**
   * Normaliza entrada (case-insensitive + trim).
   */
  private static normalize(value: string): CardBrandType {
    const formatted = value.trim().toLowerCase();

    const found = CardBrand.ALLOWED_BRANDS.find(
      (brand) => brand.toLowerCase() === formatted,
    );

    if (!found) {
      throw new Error(`Bandeira do cartão inválida: ${value}`);
    }

    return found;
  }
}
