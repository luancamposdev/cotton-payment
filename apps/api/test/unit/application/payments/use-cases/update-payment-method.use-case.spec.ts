import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';

import { InMemoryPaymentMethodRepository } from '@test/in-memory-payment-method.repository';

import { UpdatePaymentMethodUseCase } from '@application/payments/use-cases/update-payment-method.use-case';

import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

describe('UpdatePaymentMethodUseCase', () => {
  let paymentMethodRepository: InMemoryPaymentMethodRepository;
  let updatePaymentMethodUseCase: UpdatePaymentMethodUseCase;

  beforeEach(() => {
    paymentMethodRepository = new InMemoryPaymentMethodRepository();
    updatePaymentMethodUseCase = new UpdatePaymentMethodUseCase(
      paymentMethodRepository,
    );
  });

  it('should update providerToken, brand, last4, expMonth and expYear', async () => {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('customer-123'),
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('old-valid-token-123456'),
      brand: null,
      expMonth: null,
      expYear: null,
      last4: null,
    });

    await paymentMethodRepository.create(paymentMethod);

    const bradCar = new CardBrand('Visa');

    const updated = await updatePaymentMethodUseCase.execute({
      id: paymentMethod.id,
      providerToken: 'new-valid-token-987654',
      brand: bradCar,
      last4: '4242',
      expMonth: 12,
      expYear: 2030,
    });

    expect(updated.providerToken.value).toBe('new-valid-token-987654');
    expect(updated.brand!.value).toBe('Visa');
    expect(updated.last4!.value).toBe('4242');
    expect(updated.expMonth!.value).toBe(12);
    expect(updated.expYear!.value).toBe(2030);

    const persisted = await paymentMethodRepository.findById(paymentMethod.id);
    expect(persisted?.providerToken.value).toBe('new-valid-token-987654');
  });

  it('should update only provided fields', async () => {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('customer-456'),
      provider: PaymentProvider.PAYPAL,
      providerToken: new ProviderToken('old-valid-token-123456'),
      brand: new CardBrand('Mastercard'),
      last4: new Last4('4242'),
      expMonth: new ExpMonth(12),
      expYear: new ExpYear(2030),
    });

    await paymentMethodRepository.create(paymentMethod);

    const updated = await updatePaymentMethodUseCase.execute({
      id: paymentMethod.id,
      last4: '1111',
      brand: null,
      expMonth: null,
      expYear: null,
      providerToken: null,
    });

    expect(updated.last4!.value).toBe('1111');
    expect(updated.brand!.value).toBe('Mastercard');
    expect(updated.providerToken.value).toBe('old-valid-token-123456');
  });

  it('should throw if payment method does not exist', async () => {
    await expect(
      updatePaymentMethodUseCase.execute({
        id: 'invalid-id',
        providerToken: 'token',
        brand: null,
        expMonth: null,
        expYear: null,
        last4: null,
      }),
    ).rejects.toThrow('Método de pagamento não encontrado.');
  });
});
