import { BadRequestException, Injectable } from '@nestjs/common';

import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';
import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';

import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

export interface ICreatePaymentMethodRequest {
  provider: PaymentProvider;
  providerToken: string;
  brand?: string | null;
  last4?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
}

@Injectable()
export class CreatePaymentMethodUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(
    request: ICreatePaymentMethodRequest,
    customerId: string,
  ): Promise<{ paymentMethod: PaymentMethodEntity }> {
    try {
      const paymentMethod = new PaymentMethodEntity({
        customerId: new CustomerId(customerId),
        provider: request.provider,
        providerToken: new ProviderToken(request.providerToken),
        brand: request.brand ? CardBrand.create(request.brand) : null,
        last4: request.last4 ? new Last4(request.last4) : null,
        expMonth:
          request.expMonth != null ? new ExpMonth(request.expMonth) : null,
        expYear: request.expYear != null ? new ExpYear(request.expYear) : null,
      });

      await this.paymentMethodRepository.create(paymentMethod);

      return { paymentMethod };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Não foi possível criar o método de pagamento: ${error.message}`,
        );
      }

      throw new BadRequestException(
        'Não foi possível criar o método de pagamento: erro desconhecido.',
      );
    }
  }
}
