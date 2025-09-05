import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';
import { NotFoundException } from '@nestjs/common';

export class FindPaymentMethodsByCustomerUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(
    customerId: string,
  ): Promise<{ paymentMethods: PaymentMethodEntity[] }> {
    const paymentMethods =
      await this.paymentMethodRepository.findByCustomerId(customerId);

    if (!paymentMethods)
      throw new NotFoundException('Método de pagamento não encontrado.');

    return { paymentMethods };
  }
}
