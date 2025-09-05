import { PaymentMethod as PrismaPaymentMethod } from '@prisma/client';

import {
  PaymentMethodEntity,
  PaymentProvider,
} from '@core/payments/entities/payment-method.entity';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

export class PaymentMethodMapper {
  static toDomain(raw: PrismaPaymentMethod): PaymentMethodEntity {
    return new PaymentMethodEntity(
      {
        customerId: new CustomerId(raw.customerId),
        provider: raw.provider as PaymentProvider,
        providerToken: new ProviderToken(raw.providerToken),
        brand: raw.brand ? new CardBrand(raw.brand) : undefined,
        last4: raw.last4 ? new Last4(raw.last4) : undefined,
        expMonth: raw.expMonth ? new ExpMonth(raw.expMonth) : undefined,
        expYear: raw.expYear ? new ExpYear(raw.expYear) : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  static toPrisma(entity: PaymentMethodEntity): PrismaPaymentMethod {
    return {
      id: entity.id,
      customerId: entity.customerId.value,
      provider: entity.provider,
      providerToken: entity.providerToken.value,
      brand: entity.brand ? entity.brand.value : null,
      last4: entity.last4 ? entity.last4.value : null,
      expMonth: entity.expMonth ? entity.expMonth.value : null,
      expYear: entity.expYear ? entity.expYear.value : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
