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
import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';

export interface ICreatePaymentMethodRequest {
  customerId: CustomerId;
  provider: PaymentProvider;
  providerToken: ProviderToken;
  brand?: CardBrand;
  last4?: Last4;
  expMonth?: ExpMonth;
  expYear?: ExpYear;
}

export class CreatePaymentMethodUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(
    request: ICreatePaymentMethodRequest,
  ): Promise<PaymentMethodEntity> {
    const paymentMethod = new PaymentMethodEntity({
      customerId: request.customerId,
      provider: request.provider,
      providerToken: request.providerToken,
      brand: request.brand,
      last4: request.last4,
      expMonth: request.expMonth,
      expYear: request.expYear,
    });

    return this.paymentMethodRepository.create(paymentMethod);
  }
}
