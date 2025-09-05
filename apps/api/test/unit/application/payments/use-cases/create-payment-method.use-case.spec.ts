import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';
import { InMemoryPaymentMethodRepository } from '@test/in-memory-payment-method.repository';
import { PaymentProvider } from '@core/payments/entities/payment-method.entity';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';

describe('CreatePaymentMethodUseCase', () => {
  let repository: InMemoryPaymentMethodRepository;
  let useCase: CreatePaymentMethodUseCase;

  beforeEach(() => {
    repository = new InMemoryPaymentMethodRepository();
    useCase = new CreatePaymentMethodUseCase(repository);
  });

  it('should create a payment method with all details', async () => {
    const result = await useCase.execute({
      customerId: 'customer-123',
      provider: PaymentProvider.STRIPE,
      providerToken: 'valid-token-123456',
      brand: 'VISA',
      last4: '4242',
      expMonth: 12,
      expYear: 2030,
    });

    expect(result.paymentMethod.customerId.value).toBe('customer-123');
    expect(result.paymentMethod.provider).toBe(PaymentProvider.STRIPE);
    expect(result.paymentMethod.providerToken.value).toBe('valid-token-123456');
    expect(result.paymentMethod.brand!.value).toBe('VISA');
    expect(result.paymentMethod.last4!.value).toBe('4242');
    expect(result.paymentMethod.expMonth!.value).toBe(12);
    expect(result.paymentMethod.expYear!.value).toBe(2030);

    const persisted = await repository.findById(result.paymentMethod.id);
    expect(persisted?.id).toBe(result.paymentMethod.id);
  });

  it('should create a payment method with only required fields', async () => {
    const request = {
      customerId: 'customer-456',
      provider: PaymentProvider.PAYPAL,
      providerToken: 'another-valid-token',
    };

    const { paymentMethod } = await useCase.execute(request);

    expect(paymentMethod.customerId.value).toBe('customer-456');
    expect(paymentMethod.provider).toBe(PaymentProvider.PAYPAL);
    expect(paymentMethod.providerToken.value).toBe('another-valid-token');
    expect(paymentMethod.brand).toBeUndefined();
    expect(paymentMethod.last4).toBeUndefined();
    expect(paymentMethod.expMonth).toBeUndefined();
    expect(paymentMethod.expYear).toBeUndefined();
  });
});
