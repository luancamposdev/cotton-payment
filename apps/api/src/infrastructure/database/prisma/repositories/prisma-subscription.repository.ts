import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { PrismaSubscriptionMapper } from '@infrastructure/database/prisma/mappers/prisma-subscription-mapper';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(subscription: SubscriptionEntity): Promise<void> {
    const data = PrismaSubscriptionMapper.toPrisma(subscription);
    await this.prisma.subscription.create({ data });
  }

  async findById(id: string): Promise<SubscriptionEntity | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    return subscription
      ? PrismaSubscriptionMapper.toDomain(subscription)
      : null;
  }

  async findByCustomerId(customerId: string): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { customerId },
    });
    return subscriptions.map((subscription) =>
      PrismaSubscriptionMapper.toDomain(subscription),
    );
  }

  async save(subscription: SubscriptionEntity): Promise<void> {
    const data = PrismaSubscriptionMapper.toPrisma(subscription);
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data,
    });
  }

  async findAllActiveOrTrial(): Promise<SubscriptionEntity[]> {
    const raws = await this.prisma.subscription.findMany({
      where: {
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
    });
    return raws.map((raw) => PrismaSubscriptionMapper.toDomain(raw));
  }
}
