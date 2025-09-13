import { PayoutRawPayloadVO } from '@core/payout/value-objects/payout-raw-payload.vo';

describe('RawPayload', () => {
  it('deve aceitar payload válido', () => {
    const payload = new PayoutRawPayloadVO({
      provider: 'stripe',
      transactionId: 'tx_123',
      status: 'pending',
    });

    expect(payload.value.provider).toBe('stripe');
    expect(payload.value.transactionId).toBe('tx_123');
    expect(payload.value.status).toBe('pending');
  });

  it('deve lançar erro se não for objeto', () => {
    expect(() => new PayoutRawPayloadVO(null as any)).toThrow(
      'Invalid rawPayload',
    );
  });

  it('deve lançar erro se faltar campos obrigatórios', () => {
    expect(() => new PayoutRawPayloadVO({ provider: 'stripe' } as any)).toThrow(
      'rawPayload missing required fields',
    );
  });
});
