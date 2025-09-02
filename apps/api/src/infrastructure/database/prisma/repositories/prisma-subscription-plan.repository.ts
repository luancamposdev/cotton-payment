import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { PrismaSubscriptionPlanMapper } from '@infrastructure/database/prisma/mappers/prisma-subscription-plan.mapper';

@Injectable()
export class PrismaSubscriptionPlanRepository
  implements SubscriptionPlanRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(plan: SubscriptionPlanEntity): Promise<void> {
    const raw = PrismaSubscriptionPlanMapper.toPrisma(plan);
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

  async save(plan: SubscriptionPlanEntity): Promise<void> {
    const raw = PrismaSubscriptionPlanMapper.toPrisma(plan);

    const updated = await this.prismaService.subscriptionPlan.update({
      where: { id: plan.id },
      data: raw,
    });

    PrismaSubscriptionPlanMapper.toDomain(updated); // atualiza VO se necessário
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prismaService.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(
        `Subscription plan not found for this id: ${id}`,
      );

    await this.prismaService.subscriptionPlan.delete({ where: { id } });
  }
}
