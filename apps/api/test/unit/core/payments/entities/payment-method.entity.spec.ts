import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';
import { UpdatePaymentMethodUseCase } from '@application/payments/use-cases/update-payment-method.use-case';
import { InMemoryPaymentMethodRepository } from '@test/in-memory-payment-method.repository';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { NotFoundException } from '@nestjs/common';

describe('UpdatePaymentMethodUseCase', () => {
  let repository: InMemoryPaymentMethodRepository;
  let useCase: UpdatePaymentMethodUseCase;

  beforeEach(() => {
    repository = new InMemoryPaymentMethodRepository();
    useCase = new UpdatePaymentMethodUseCase(repository);
  });

  it('should update all payment method fields', async () => {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('customer-123'),
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('valid-token-123456'),
    });

    await repository.create(paymentMethod);

    const updated = await useCase.execute({
      id: paymentMethod.id,
      providerToken: 'updated-token-654321',
      brand: 'VISA',
      last4: '4242',
      expMonth: 12,
      expYear: 2030,
    });

    expect(updated.providerToken.value).toBe('updated-token-654321');
    expect(updated.brand!.value).toBe('VISA');
    expect(updated.last4!.value).toBe('4242');
    expect(updated.expMonth!.value).toBe(12);
    expect(updated.expYear!.value).toBe(2030);

    const persisted = await repository.findById(paymentMethod.id);
    expect(persisted?.providerToken.value).toBe('updated-token-654321');
  });

  it('should update only provided fields', async () => {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('customer-456'),
      provider: PaymentProvider.PAYPAL,
      providerToken: new ProviderToken('valid-token-abcdef'),
      brand: new CardBrand('MASTERCARD'),
    });

    await repository.create(paymentMethod);

    const updated = await useCase.execute({
      id: paymentMethod.id,
      last4: '1111',
    });

    expect(updated.last4!.value).toBe('1111');
    expect(updated.brand!.value).toBe('MASTERCARD'); // não alterou
    expect(updated.providerToken.value).toBe('valid-token-abcdef'); // não alterou
  });

  it('should throw NotFoundException if payment method does not exist', async () => {
    await expect(
      useCase.execute({
        id: 'non-existent-id',
        providerToken: 'token-123456',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
