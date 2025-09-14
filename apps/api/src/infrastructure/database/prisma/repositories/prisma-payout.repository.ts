import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutMapper } from '@infrastructure/database/prisma/mappers/payout.mapper';
import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaPayoutRepository implements PayoutRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: PayoutEntity): Promise<void> {
    const data = PayoutMapper.toPersistence(entity);

    await this.prismaService.payout.create({
      data: {
        ...data,
        rawPayload: data.rawPayload ?? Prisma.DbNull,
      },
    });
  }

  async save(entity: PayoutEntity): Promise<void> {
    const data = PayoutMapper.toPersistence(entity);

    await this.prismaService.payout.update({
      where: { id: entity.id.value },
      data: {
        ...data,
        rawPayload: data.rawPayload ?? Prisma.DbNull,
      },
    });
  }

  async delete(id: PayoutIdVO): Promise<void> {
    await this.prismaService.payout.delete({
      where: { id: id.value },
    });
  }

  async findById(id: PayoutIdVO): Promise<PayoutEntity | null> {
    const raw = await this.prismaService.payout.findUnique({
      where: { id: id.value },
    });
    return raw ? PayoutMapper.toEntity(raw) : null;
  }

  async findByCreatorConfigId(
    creatorPayoutConfigId: CreatorPayoutConfigIdVO,
  ): Promise<PayoutEntity[]> {
    const raws = await this.prismaService.payout.findMany({
      where: { creatorPayoutConfigId: creatorPayoutConfigId.value },
    });

    return raws.map((raw) => PayoutMapper.toEntity(raw));
  }

  async list(): Promise<PayoutEntity[]> {
    const raws = await this.prismaService.payout.findMany();
    return raws.map((raw) => PayoutMapper.toEntity(raw));
  }
}
