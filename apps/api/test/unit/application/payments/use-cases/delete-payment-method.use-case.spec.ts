import { NotFoundException } from '@nestjs/common';

import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';
import { PaymentProvider } from '@core/payments/entities/payment-method.entity';

import { InMemoryPaymentMethodRepository } from '@test/in-memory-payment-method.repository';

import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { DeletePaymentMethodUseCase } from '@application/payments/use-cases/delete-payment-method.use-case';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

describe('DeletePaymentMethodUseCase', () => {
  let repository: InMemoryPaymentMethodRepository;
  let useCase: DeletePaymentMethodUseCase;

  beforeEach(() => {
    repository = new InMemoryPaymentMethodRepository();
    useCase = new DeletePaymentMethodUseCase(repository);
  });

  it('deve deletar um método de pagamento existente', async () => {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId('pm-1'),
      provider: PaymentProvider.STRIPE,
      providerToken: new ProviderToken('valid_tok_123'),
      brand: new CardBrand('Visa'),
      last4: new Last4('4242'),
      expMonth: new ExpMonth(12),
      expYear: new ExpYear(2030),
    });

    await repository.create(paymentMethod);

    expect(await repository.findById(paymentMethod.id)).toBeTruthy();

    await useCase.execute(paymentMethod.id);

    expect(await repository.findById(paymentMethod.id)).toBeNull();
  });

  it('deve lançar NotFoundException ao tentar deletar método inexistente', async () => {
    await expect(useCase.execute('pm-999')).rejects.toThrow(NotFoundException);
  });
});
