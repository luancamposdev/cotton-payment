import { Injectable } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { PaymentMethodEntity } from '@/core/payments/entities/payment-method.entity';
import { PaymentMethodMapper } from '@infrastructure/database/prisma/mappers/payment-method.mapper';
import { PrismaAddressMapper } from '@infrastructure/database/prisma/mappers/prisma-address.mapper';

@Injectable()
export class PrismaPaymentMethodRepository implements PaymentMethodRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(paymentMethod: PaymentMethodEntity): Promise<void> {
    const raw = PaymentMethodMapper.toPrisma(paymentMethod);
    await this.prismaService.paymentMethod.create({ data: raw });
  }

  update(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity> {
    throw new Error('Method not implemented.');
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

  findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]> {
    throw new Error('Method not implemented.');
  }
}
