import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

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

  it('should update card details and updatedAt', async () => {
    const oldUpdatedAt = paymentMethod.updatedAt;

    // Criar VO para os detalhes do cartão
    const brand = new CardBrand('Visa');
    const last4 = new Last4('4242');
    const expMonth = new ExpMonth(12);
    const expYear = new ExpYear(2030);

    // Atualizar os detalhes do cartão
    paymentMethod.updateCardDetails(brand, last4, expMonth, expYear);

    expect(paymentMethod.brand!.value).toBe('Visa');
    expect(paymentMethod.last4!.value).toBe('4242');
    expect(paymentMethod.expMonth!.value).toBe(12);
    expect(paymentMethod.expYear!.value).toBe(2030);

    expect(paymentMethod.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });

  it('should throw if card details are incomplete', () => {
    const brand = new CardBrand('Visa');
    const last4 = null;
    const expMonth = new ExpMonth(12);
    const expYear = new ExpYear(2030);

    expect(() =>
      paymentMethod.updateCardDetails(brand, last4, expMonth, expYear),
    ).toThrow('Card details are incomplete');
  });

  it('should allow setting all card details to null if brand is null', () => {
    expect(() =>
      paymentMethod.updateCardDetails(null, null, null, null),
    ).not.toThrow();
  });
});
