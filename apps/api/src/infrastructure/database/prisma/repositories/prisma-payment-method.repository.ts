import { Injectable } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { PaymentMethodEntity } from '@/core/payments/entities/payment-method.entity';
import { PaymentMethodMapper } from '@infrastructure/database/prisma/mappers/payment-method.mapper';

@Injectable()
export class PrismaPaymentMethodRepository implements PaymentMethodRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(paymentMethod: PaymentMethodEntity): Promise<void> {
    const raw = PaymentMethodMapper.toPrisma(paymentMethod);
    await this.prismaService.paymentMethod.create({ data: raw });
  }

  async save(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity> {
    const raw = PaymentMethodMapper.toPrisma(paymentMethod);

    const updated = await this.prismaService.paymentMethod.update({
      where: { id: paymentMethod.id },
      data: raw,
    });

    return PaymentMethodMapper.toDomain(updated);
  }

  async findById(id: string): Promise<PaymentMethodEntity | null> {
    if (!id || id.trim() === '') {
      return null;
    }

    const raw = await this.prismaService.paymentMethod.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return PaymentMethodMapper.toDomain(raw);
  }

  async findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]> {
    if (!customerId.trim()) return Promise.resolve([]);

    const raws = await this.prismaService.paymentMethod.findMany({
      where: { customerId },
    });

    return raws.map((raw) => PaymentMethodMapper.toDomain(raw));
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.paymentMethod.delete({
      where: { id },
    });
  }
}
