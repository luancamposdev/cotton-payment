import { Injectable, NotFoundException } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';

import { CardBrand } from '@core/payments/value-objects/card-brand.vo';

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
    const raw = await this.paymentMethodRepository.findById(id);

    if (!raw) {
      throw new NotFoundException('Método de pagamento não encontrado.');
    }

    if (request.providerToken) raw.updateProviderToken(request.providerToken);
    if (request.brand) raw.updateBrand(request.brand);
    if (request.last4) raw.updateLast4(request.last4);
    if (request.expMonth) raw.updateExpMonth(request.expMonth);
    if (request.expYear) raw.updateExpYear(request.expYear);

    const paymentMethod = await this.paymentMethodRepository.save(raw);

    return { paymentMethod };
  }
}
