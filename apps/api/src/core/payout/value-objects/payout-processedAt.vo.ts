export class PayoutProcessedAtVO {
  public readonly value: Date | null;

  constructor(value: Date | null) {
    if (value !== null) {
      if (isNaN(value.getTime())) {
        throw new Error('ProcessedAt must be a valid Date or null');
      }

      if (value.getTime() > Date.now()) {
        throw new Error('ProcessedAt cannot be a future date');
      }
    }

    this.value = value;
  }

  /**
   * Verifica se o payout já foi processado
   */
  public isProcessed(): boolean {
    return this.value !== null;
  }

  /**
   * Compara dois ProcessedAt
   */
  public equals(other: PayoutProcessedAtVO): boolean {
    if (this.value === null && other.value === null) return true;
    if (this.value === null || other.value === null) return false;
    return this.value.getTime() === other.value.getTime();
  }
}
