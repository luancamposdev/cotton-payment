import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';

export class PaymentMethodViewModel {
  static toHTTP(entity: PaymentMethodEntity) {
    return {
      id: entity.id,
      customerId: entity.customerId.value,
      provider: entity.provider,
      providerToken: entity.providerToken.value,
      brand: entity.brand?.value,
      last4: entity.last4?.value,
      expMonth: entity.expMonth?.value,
      expYear: entity.expYear?.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
