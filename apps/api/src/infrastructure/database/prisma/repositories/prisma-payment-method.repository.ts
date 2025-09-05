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

  update(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<PaymentMethodEntity | null> {
    throw new Error('Method not implemented.');
  }
  findByCustomerId(customerId: string): Promise<PaymentMethodEntity[]> {
    throw new Error('Method not implemented.');
  }
}
