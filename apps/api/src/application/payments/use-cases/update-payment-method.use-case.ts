import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';
import { NotFoundException } from '@nestjs/common';

export interface UpdatePaymentMethodRequest {
  id: string;
  providerToken?: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
}

export class UpdatePaymentMethodUseCase {
  constructor(private paymentMethodRepository: PaymentMethodRepository) {}

  async execute(
    request: UpdatePaymentMethodRequest,
  ): Promise<PaymentMethodEntity> {
    const paymentMethod = await this.paymentMethodRepository.findById(
      request.id,
    );

    if (!paymentMethod)
      throw new NotFoundException('Método de pagamento não encontrado.');

    if (request.providerToken)
      paymentMethod.updateProviderToken(request.providerToken);
    if (request.brand) paymentMethod.updateBrand(request.brand);
    if (request.last4) paymentMethod.updateLast4(request.last4);
    if (request.expMonth) paymentMethod.updateExpMonth(request.expMonth);
    if (request.expYear) paymentMethod.updateExpYear(request.expYear);

    return this.paymentMethodRepository.update(paymentMethod);
  }
}
