import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { PrismaSubscriptionPlanMapper } from '@infrastructure/database/prisma/mappers/prisma-subscription-plan.mapper';

import { BillingInterval as PrismaBillingInterval } from '@prisma/client';

@Injectable()
export class PrismaSubscriptionPlanRepository
  implements SubscriptionPlanRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(subscriptionPlan: SubscriptionPlanEntity): Promise<void> {
    const raw = {
      id: subscriptionPlan.id,
      creatorId: subscriptionPlan.creatorId,
      name: subscriptionPlan.name.value,
      description: subscriptionPlan.description,
      price: subscriptionPlan.price.value,
      currency: subscriptionPlan.currency.value,
      billingInterval: subscriptionPlan.billingInterval
        .value as PrismaBillingInterval,
      trialDays: subscriptionPlan.trialDays?.value ?? null,
      features: subscriptionPlan.features?.value ?? [],
      createdAt: subscriptionPlan.createdAt,
      updatedAt: subscriptionPlan.updatedAt,
    };

    await this.prismaService.subscriptionPlan.create({ data: raw });
  }

  async findById(id: string): Promise<SubscriptionPlanEntity | null> {
    if (!id || id.trim() === '') return null;

    const raw = await this.prismaService.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!raw) return null;

    return PrismaSubscriptionPlanMapper.toDomain(raw);
  }

  async findByCreatorId(creatorId: string): Promise<SubscriptionPlanEntity[]> {
    const raws = await this.prismaService.subscriptionPlan.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
    });

    return raws.map((raw) => PrismaSubscriptionPlanMapper.toDomain(raw));
  }

  async save(subscriptionPlan: SubscriptionPlanEntity): Promise<void> {
    const raw = {
      id: subscriptionPlan.id,
      creatorId: subscriptionPlan.creatorId,
      name: subscriptionPlan.name.value,
      description: subscriptionPlan.description,
      price: subscriptionPlan.price.value,
      currency: subscriptionPlan.currency.value,
      billingInterval: subscriptionPlan.billingInterval
        .value as PrismaBillingInterval,
      trialDays: subscriptionPlan.trialDays?.value ?? null,
      features: subscriptionPlan.features?.value ?? [],
      createdAt: subscriptionPlan.createdAt,
      updatedAt: subscriptionPlan.updatedAt,
    };

    await this.prismaService.subscriptionPlan.update({
      where: { id: subscriptionPlan.id },
      data: raw,
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prismaService.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Subscription plan not found for this id: ${id}`,
      );
    }

    await this.prismaService.subscriptionPlan.delete({ where: { id } });
  }
}
