import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { AmountVO } from '@core/Order/entities/value-objects/amount.vo';
import { CurrencyVO } from '@core/Order/entities/value-objects/currency.vo';
import { OrderEntity } from '@core/Order/entities/order.entity';
import { PaymentStatusVO } from '@core/Order/entities/value-objects/payment-status.vo';

describe('OrderEntity', () => {
  const customerId = new CustomerId('cus_123');
  const amount = new AmountVO(1000);
  const currency = new CurrencyVO('BRL');

  it('should create an order with default values', () => {
    const order = new OrderEntity({
      customerId,
      amount,
      currency,
      creatorId: 'creator_123',
      description: 'Test order',
    });

    expect(order).toBeTruthy();
    expect(order.id).toBeDefined();
    expect(order.createdAt).toBeDefined();
    expect(order.updatedAt).toBeDefined();
    expect(order.customerId).toBe(customerId);
    expect(order.amount).toBe(amount);
    expect(order.currency).toBe(currency);
    expect(order.creatorId).toBe('creator_123');
    expect(order.description).toBe('Test order');
  });

  it('should allow updating status', () => {
    const order = new OrderEntity({
      customerId,
      amount,
      currency,
      creatorId: 'creator_123',
      description: 'Test order',
    });

    const newStatus = new PaymentStatusVO('PAID');

    order.updateStatus(newStatus);
    expect(order.status.equals(newStatus)).toBe(true);
  });

  it('should allow updating amount, currency, and description', () => {
    const order = new OrderEntity({
      customerId,
      amount,
      currency,
      creatorId: 'creator_123',
      description: null,
    });

    const newAmount = new AmountVO(10000);
    const newCurrency = new CurrencyVO('USD');
    const description = 'Test order';

    order.updateAmount(newAmount);
    order.updateCurrency(newCurrency);
    order.updateDescription(description);

    expect(order.amount.value).toBe(10000);
    expect(order.currency.value).toBe('USD');
    expect(order.description).toBe('Test order');
  });

  it('should update updatedAt when touching entity', () => {
    const order = new OrderEntity({
      customerId,
      amount,
      currency,
      creatorId: 'creator_123',
      description: null,
    });
    const prevUpdatedAt = order.updatedAt;

    const newStatus = new PaymentStatusVO('PAID');
    order.updateStatus(newStatus);

    expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });
});
