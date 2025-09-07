import { PaymentMethodEntity } from '../entities/payment-method.entity';

export abstract class PaymentMethodRepository {
  abstract create(paymentMethod: PaymentMethodEntity): Promise<void>;
  abstract save(
    paymentMethod: PaymentMethodEntity,
  ): Promise<PaymentMethodEntity>;
  abstract findById(id: string): Promise<PaymentMethodEntity | null>;
  abstract findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]>;
  abstract delete(id: string): Promise<void>;
}
