import { FindPaymentMethodsByCustomerUseCase } from '@application/payments/use-cases/find-payment-methods-by-customer.use-case';
import { InMemoryPaymentMethodRepository } from '@test/in-memory-payment-method.repository';
import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';

describe('FindPaymentMethodsByCustomerUseCase', () => {
  let repository: InMemoryPaymentMethodRepository;
  let useCase: FindPaymentMethodsByCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryPaymentMethodRepository();
    useCase = new FindPaymentMethodsByCustomerUseCase(repository);
  });

  it('should return all payment methods for a given customer', async () => {
    const customerId = new CustomerId('customer-123');

    const paymentMethod1 = new PaymentMethodEntity({
      customerId,
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('valid-token-123456'),
    });

    const paymentMethod2 = new PaymentMethodEntity({
      customerId,
      provider: PaymentProvider.PAYPAL,
      providerToken: new ProviderToken('valid-token-841395'),
    });

    await repository.create(paymentMethod1);
    await repository.create(paymentMethod2);

    const result = await useCase.execute(customerId.value);

    expect(result.paymentMethods).toHaveLength(2);
    expect(result.paymentMethods.map((pm) => pm.id)).toEqual(
      expect.arrayContaining([paymentMethod1.id, paymentMethod2.id]),
    );
  });

  it('should throw NotFoundException if no payment methods exist for the customer', async () => {
    const customerId = 'non-existent-customer';

    await expect(useCase.execute(customerId)).rejects.toThrow(
      'Método de pagamento não encontrado.',
    );
  });
});
