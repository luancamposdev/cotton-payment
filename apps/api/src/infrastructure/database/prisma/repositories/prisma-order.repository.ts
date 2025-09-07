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

  findAllByCustomer(customerId: string): Promise<OrderEntity[]> {
    return Promise.resolve([]);
  }

  findById(id: string): Promise<OrderEntity | null> {
    return Promise.resolve(null);
  }

  delete(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
