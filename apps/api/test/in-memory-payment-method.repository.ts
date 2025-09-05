import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';
import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';

export class InMemoryPaymentMethodRepository
  implements PaymentMethodRepository
{
  public paymentMethods: PaymentMethodEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(paymentMethod: PaymentMethodEntity): Promise<void> {
    this.paymentMethods.push(paymentMethod);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<PaymentMethodEntity | null> {
    const paymentMethod = this.paymentMethods.find((item) => item.id === id);
    return paymentMethod ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]> {
    return this.paymentMethods.filter(
      (item) => item.customerId.value === customerId,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(
    paymentMethod: PaymentMethodEntity,
  ): Promise<PaymentMethodEntity> {
    const index = this.paymentMethods.findIndex(
      (item) => item.id === paymentMethod.id,
    );
    if (index === -1) {
      throw new Error('Payment method not found.');
    }
    this.paymentMethods[index] = paymentMethod;
    return paymentMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<void> {
    this.paymentMethods = this.paymentMethods.filter((item) => item.id !== id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async clear(): Promise<void> {
    this.paymentMethods = [];
  }
}
