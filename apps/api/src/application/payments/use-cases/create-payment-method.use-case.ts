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
  customerId: string;
  provider: PaymentProvider;
  providerToken: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
}

export class CreatePaymentMethodUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(
    request: ICreatePaymentMethodRequest,
  ): Promise<{ paymentMethod: PaymentMethodEntity }> {
    const paymentMethod = new PaymentMethodEntity({
      customerId: new CustomerId(request.customerId),
      provider: request.provider,
      providerToken: new ProviderToken(request.providerToken),
      brand: request.brand ? new CardBrand(request.brand) : undefined,
      last4: request.last4 ? new Last4(request.last4) : undefined,
      expMonth: request.expMonth ? new ExpMonth(request.expMonth) : undefined,
      expYear: request.expYear ? new ExpYear(request.expYear) : undefined,
    });

    await this.paymentMethodRepository.create(paymentMethod);

    return { paymentMethod };
  }
}
