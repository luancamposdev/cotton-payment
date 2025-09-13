import { Injectable, NotFoundException } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';

import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

export interface UpdatePaymentMethodRequest {
  providerToken?: string | null;
  brand?: CardBrand | null;
  last4?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
}

@Injectable()
export class UpdatePaymentMethodUseCase {
  constructor(private paymentMethodRepository: PaymentMethodRepository) {}

  async execute(
    id: string,
    request: UpdatePaymentMethodRequest,
  ): Promise<{ paymentMethod: PaymentMethodEntity }> {
    const paymentMethod = await this.paymentMethodRepository.findById(id);
    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado.');
    }

    if (request.providerToken) {
      paymentMethod.updateProviderToken(request.providerToken);
    }

    // Atualiza detalhes do cartão se qualquer campo estiver presente
    if (
      request.brand !== undefined ||
      request.last4 !== undefined ||
      request.expMonth !== undefined ||
      request.expYear !== undefined
    ) {
      paymentMethod.updateCardDetails(
        request.brand ?? paymentMethod.brand,
        request.last4 ? new Last4(request.last4) : paymentMethod.last4,
        request.expMonth
          ? new ExpMonth(request.expMonth)
          : paymentMethod.expMonth,
        request.expYear ? new ExpYear(request.expYear) : paymentMethod.expYear,
      );
    }

    await this.paymentMethodRepository.save(paymentMethod);

    return { paymentMethod };
  }
}
