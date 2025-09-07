import { CustomerId } from '@core/payments/value-objects/customer-id.vo';

describe('CustomerIdVO', () => {
  it('deve criar um CustomerId válido', () => {
    const customerId = new CustomerId('cust-123');
    expect(customerId.value).toBe('cust-123');
  });

  it('deve lançar erro se valor for vazio', () => {
    expect(() => new CustomerId('')).toThrow('CustomerId is required');
  });

  it('deve lançar erro se valor for undefined', () => {
    // @ts-expect-error Testando construtor sem argumento
    expect(() => new CustomerId(undefined)).toThrow('CustomerId is required');
  });
});
