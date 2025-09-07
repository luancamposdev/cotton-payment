import { Injectable } from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { PrismaOrderMapper } from '@infrastructure/database/prisma/mappers/prisma-order.mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(order: OrderEntity): Promise<void> {
    const raw = PrismaOrderMapper.toPrisma(order);

    await this.prismaService.order.create({ data: raw });
  }

  async findById(id: string): Promise<OrderEntity | null> {
    if (!id || id.trim() === '') {
      return null;
    }

    const raw = await this.prismaService.order.findUnique({ where: { id } });

    if (!raw) return null;

    return PrismaOrderMapper.toDomain(raw);
  }

  findAllByCustomer(customerId: string): Promise<OrderEntity[]> {
    return Promise.resolve([]);
  }

  delete(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
