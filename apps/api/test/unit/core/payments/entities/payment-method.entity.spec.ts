import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';

describe('PaymentMethodEntity', () => {
  let paymentMethod: PaymentMethodEntity;

  beforeEach(() => {
    paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('customer-123'),
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('token-123456'),
      brand: null,
      last4: null,
      expMonth: null,
      expYear: null,
    });
  });

  it('should update providerToken and updatedAt', () => {
    const oldUpdatedAt = paymentMethod.updatedAt;

    paymentMethod.updateProviderToken('new-token-654321');

    expect(paymentMethod.providerToken.value).toBe('new-token-654321');
    expect(paymentMethod.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });

  it('should update brand and updatedAt', async () => {
    const oldUpdatedAt = paymentMethod.updatedAt;

    await new Promise((r) => setTimeout(r, 1));

    paymentMethod.updateBrand(new CardBrand('Visa'));

    expect(paymentMethod.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });

  it('should update last4 and updatedAt', async () => {
    const oldUpdatedAt = paymentMethod.updatedAt;

    await new Promise((r) => setTimeout(r, 5));

    paymentMethod.updateLast4('4242');

    expect(paymentMethod.last4!.value).toBe('4242');
    expect(paymentMethod.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });

  it('should update expMonth and updatedAt', async () => {
    const oldUpdatedAt = paymentMethod.updatedAt;

    await new Promise((r) => setTimeout(r, 5));

    paymentMethod.updateExpMonth(12);

    expect(paymentMethod.expMonth!.value).toBe(12);
    expect(paymentMethod.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });

  it('should update expYear and updatedAt', () => {
    const oldUpdatedAt = paymentMethod.updatedAt;

    paymentMethod.updateExpYear(2030);

    expect(paymentMethod.expYear!.value).toBe(2030);
    expect(paymentMethod.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });
});
