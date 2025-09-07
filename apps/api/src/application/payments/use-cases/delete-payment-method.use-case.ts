import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';

@Injectable()
export class DeletePaymentMethodUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findById(id);

    if (!paymentMethod)
      throw new NotFoundException('Método de pagamento não encontrado.');

    await this.paymentMethodRepository.delete(id);
  }
}
