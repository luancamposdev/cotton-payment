import { PrismaClient, Prisma } from '@prisma/client';
import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutMapper } from '@infrastructure/database/prisma/mappers/payout.mapper';

export class PrismaPayoutRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(entity: PayoutEntity): Promise<void> {
    const data = PayoutMapper.toPersistence(entity);

    await this.prisma.payout.create({
      data: {
        ...data,
        rawPayload: data.rawPayload ?? Prisma.DbNull,
      },
    });
  }

  async update(entity: PayoutEntity): Promise<void> {
    const data = PayoutMapper.toPersistence(entity);

    await this.prisma.payout.update({
      where: { id: entity.id.value },
      data: {
        ...data,
        rawPayload: data.rawPayload ?? Prisma.DbNull,
      },
    });
  }

  async findById(id: string): Promise<PayoutEntity | null> {
    const model = await this.prisma.payout.findUnique({ where: { id } });
    return model ? PayoutMapper.toEntity(model) : null;
  }
}
