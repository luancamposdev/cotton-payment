import { PayoutProcessedAtVO } from '@core/payout/value-objects/payout-processedAt.vo';

describe('PayoutProcessedAtVO', () => {
  it('deve aceitar null', () => {
    const vo = new PayoutProcessedAtVO(null);
    expect(vo.value).toBeNull();
    expect(vo.isProcessed()).toBe(false);
  });

  it('deve aceitar uma data válida no passado ou presente', () => {
    const now = new Date();
    const vo = new PayoutProcessedAtVO(now);
    expect(vo.value).toEqual(now);
    expect(vo.isProcessed()).toBe(true);
  });

  it('deve lançar erro se a data for inválida', () => {
    expect(() => new PayoutProcessedAtVO(new Date('invalid date'))).toThrow(
      'ProcessedAt must be a valid Date or null',
    );
  });

  it('deve lançar erro se a data for futura', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60);
    expect(() => new PayoutProcessedAtVO(future)).toThrow(
      'ProcessedAt cannot be a future date',
    );
  });

  it('deve comparar corretamente dois VOs iguais', () => {
    const date = new Date();
    const vo1 = new PayoutProcessedAtVO(date);
    const vo2 = new PayoutProcessedAtVO(new Date(date.getTime()));
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('deve comparar corretamente dois VOs diferentes', () => {
    const vo1 = new PayoutProcessedAtVO(new Date(Date.now() - 1000));
    const vo2 = new PayoutProcessedAtVO(new Date(Date.now()));
    expect(vo1.equals(vo2)).toBe(false);
  });

  it('deve comparar corretamente nulls', () => {
    const vo1 = new PayoutProcessedAtVO(null);
    const vo2 = new PayoutProcessedAtVO(null);
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('deve comparar null e data corretamente', () => {
    const vo1 = new PayoutProcessedAtVO(null);
    const vo2 = new PayoutProcessedAtVO(new Date());
    expect(vo1.equals(vo2)).toBe(false);
  });
});
