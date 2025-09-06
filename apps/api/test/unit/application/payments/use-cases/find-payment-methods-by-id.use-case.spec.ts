import { FindPaymentMethodByIdUseCase } from '@application/payments/use-cases/find-payment-method-by-id.use-case';
import { InMemoryPaymentMethodRepository } from '@test/in-memory-payment-method.repository';
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

describe('FindPaymentMethodByIdUseCase', () => {
  let repository: InMemoryPaymentMethodRepository;
  let useCase: FindPaymentMethodByIdUseCase;

  beforeEach(() => {
    repository = new InMemoryPaymentMethodRepository();
    useCase = new FindPaymentMethodByIdUseCase(repository);
  });

  it('should return a payment method by ID', async () => {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('customer-123'),
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('valid-token-123'),
      brand: new CardBrand('Visa'),
      last4: new Last4('4242'),
      expMonth: new ExpMonth(12),
      expYear: new ExpYear(2030),
    });

    await repository.create(paymentMethod);

    const result = await useCase.execute(paymentMethod.id);

    expect(result.paymentMethod).toBe(paymentMethod);
  });

  it('should throw NotFoundException if payment method not found', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      'Método de pagamento não encontrado.',
    );
  });
});
