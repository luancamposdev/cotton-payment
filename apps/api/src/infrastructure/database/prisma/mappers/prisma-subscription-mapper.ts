// src/infra/database/prisma/mappers/prisma-subscription-mapper.ts
import {
  Subscription as PrismaSubscription,
  SubscriptionStatus,
} from '@prisma/client';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';

export class PrismaSubscriptionMapper {
  static toDomain(raw: PrismaSubscription): SubscriptionEntity {
    return new SubscriptionEntity(
      {
        customerId: raw.customerId,
        planId: raw.planId,
        status: new SubscriptionStatusVO(raw.status),
        startDate: raw.startDate,
        endDate: raw.endDate,
        renewalAt: raw.renewalAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  static toPrisma(subscription: SubscriptionEntity): PrismaSubscription {
    return {
      id: subscription.id,
      customerId: subscription.customerId,
      planId: subscription.planId,
      status: subscription.status.value as SubscriptionStatus,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      renewalAt: subscription.renewalAt,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
