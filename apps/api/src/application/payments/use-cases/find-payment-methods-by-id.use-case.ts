import { NotFoundException } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';

export class FindPaymentMethodsByCustomerUseCase {
  constructor(private paymentMethodRepository: PaymentMethodRepository) {}

  async execute(id: string): Promise<{ paymentMethod: PaymentMethodEntity }> {
    const paymentMethod = await this.paymentMethodRepository.findById(id);

    if (!paymentMethod)
      throw new NotFoundException('Método de pagamento não encontrado.');

    return { paymentMethod };
  }
}
