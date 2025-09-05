import { PaymentMethodEntity } from '../entities/payment-method.entity';

export abstract class PaymentMethodRepository {
  abstract create(paymentMethod: PaymentMethodEntity): Promise<void>;
  abstract update(
    paymentMethod: PaymentMethodEntity,
  ): Promise<PaymentMethodEntity>;
  abstract findById(id: string): Promise<PaymentMethodEntity | null>;
  abstract findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]>;
}
