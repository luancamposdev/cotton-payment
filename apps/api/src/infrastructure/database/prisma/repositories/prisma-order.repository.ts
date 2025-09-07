import { Injectable } from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { PrismaOrderMapper } from '@infrastructure/database/prisma/mappers/prisma-order.mapper';
import { PaymentMethodMapper } from '@infrastructure/database/prisma/mappers/payment-method.mapper';
import { PaymentMethodEntity } from '@core/payments/entities/payment-method.entity';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(order: OrderEntity): Promise<void> {
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

  async findAllByCustomer(customerId: string): Promise<OrderEntity[]> {
    if (!customerId.trim()) return Promise.resolve([]);

    const raws = await this.prismaService.order.findMany({
      where: { customerId },
    });

    return raws.map((raw) => PrismaOrderMapper.toDomain(raw));
  }

  async save(order: OrderEntity): Promise<void> {
    const raw = PrismaOrderMapper.toPrisma(order);

    const updated = await this.prismaService.order.update({
      where: { id: order.id },
      data: raw,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.order.delete({
      where: { id },
    });
  }
}
