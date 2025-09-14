import { Injectable } from '@nestjs/common';
import { Order as RawOrder, PaymentStatus } from '@prisma/client';

import { OrderEntity } from '@core/Order/entities/order.entity';
import { AmountVO } from '@core/Order/value-objects/amount.vo';
import { CurrencyVO } from '@core/Order/value-objects/currency.vo';
import { PaymentStatusVO } from '@core/Order/value-objects/payment-status.vo';
import { CustomerId } from '@core/payments/value-objects/customer-id.vo';

@Injectable()
export class PrismaOrderMapper {
  static toPrisma(order: OrderEntity) {
    return {
      id: order.id,
      customerId: order.customerId.value,
      creatorId: order.creatorId,
      amountCents: order.amount.value,
      currency: order.currency.value,
      description: order.description,
      status: order.status.value as PaymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toDomain(raw: RawOrder): OrderEntity {
    return new OrderEntity(
      {
        customerId: new CustomerId(raw.customerId),
        creatorId: raw.creatorId,
        amount: new AmountVO(raw.amountCents),
        currency: CurrencyVO.create(raw.currency),
        description: raw.description,
        status: PaymentStatusVO.create(raw.status),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
