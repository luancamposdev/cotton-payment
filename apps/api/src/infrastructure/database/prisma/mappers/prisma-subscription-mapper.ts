import {
  Subscription as PrismaSubscription,
  SubscriptionStatus,
} from '@prisma/client';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

export class PrismaSubscriptionMapper {
  static toDomain(
    raw: PrismaSubscription,
    plan?: SubscriptionPlanEntity,
  ): SubscriptionEntity {
    // Criamos a assinatura usando o createFromPlan, se tivermos o plano disponível
    if (plan) {
      return SubscriptionEntity.createFromPlan(raw.customerId, plan);
    }

    return new SubscriptionEntity(
      {
        customerId: raw.customerId,
        planId: raw.planId,
        status: new SubscriptionStatusVO(raw.status),
        startDate: raw.startDate,
        trialEndsAt: raw.trialEndsAt ?? null,
        endDate: raw.endDate ?? null,
        renewalAt: raw.renewalAt ?? null,
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
      trialEndsAt: subscription.trialEndsAt,
      endDate: subscription.endDate,
      renewalAt: subscription.renewalAt,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
