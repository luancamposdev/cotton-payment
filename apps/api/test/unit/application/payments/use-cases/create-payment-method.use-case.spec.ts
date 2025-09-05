import {
  CreatePaymentMethodUseCase,
  ICreatePaymentMethodRequest,
} from '@application/payments/use-cases/create-payment-method.use-case';
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

describe('CreatePaymentMethodUseCase', () => {
  let repository: InMemoryPaymentMethodRepository;
  let useCase: CreatePaymentMethodUseCase;

  beforeEach(() => {
    repository = new InMemoryPaymentMethodRepository();
    useCase = new CreatePaymentMethodUseCase(repository);
  });

  it('should create a payment method with all fields', async () => {
    const request: ICreatePaymentMethodRequest = {
      customerId: new CustomerId('customer-123'),
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('valid-token-123456'),
      brand: new CardBrand('VISA'),
      last4: new Last4('4242'),
      expMonth: new ExpMonth(12),
      expYear: new ExpYear(2030),
    };

    const paymentMethod = await useCase.execute(request);

    expect(paymentMethod).toBeInstanceOf(PaymentMethodEntity);
    expect(paymentMethod.customerId.value).toBe('customer-123');
    expect(paymentMethod.provider).toBe(PaymentProvider.STRIPE);
    expect(paymentMethod.providerToken.value).toBe('valid-token-123456');
    expect(paymentMethod.brand!.value).toBe('VISA');
    expect(paymentMethod.last4!.value).toBe('4242');
    expect(paymentMethod.expMonth!.value).toBe(12);
    expect(paymentMethod.expYear!.value).toBe(2030);

    const persisted = await repository.findById(paymentMethod.id);
    expect(persisted).toBeDefined();
    expect(persisted?.id).toBe(paymentMethod.id);
  });

  it('should create a payment method with only required fields', async () => {
    const request: ICreatePaymentMethodRequest = {
      customerId: new CustomerId('customer-456'),
      provider: PaymentProvider.PAYPAL,
      providerToken: new ProviderToken('another-valid-token'),
    };

    const paymentMethod = await useCase.execute(request);

    expect(paymentMethod.customerId.value).toBe('customer-456');
    expect(paymentMethod.provider).toBe(PaymentProvider.PAYPAL);
    expect(paymentMethod.providerToken.value).toBe('another-valid-token');
    expect(paymentMethod.brand).toBeUndefined();
    expect(paymentMethod.last4).toBeUndefined();
    expect(paymentMethod.expMonth).toBeUndefined();
    expect(paymentMethod.expYear).toBeUndefined();
  });
});
