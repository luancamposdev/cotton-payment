import { PaymentMethodEntity } from '../entities/payment-method.entity';

export interface PaymentMethodRepository {
  create(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity>;
  update(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity>;
  findById(id: string): Promise<PaymentMethodEntity | null>;
  findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]>;
}
