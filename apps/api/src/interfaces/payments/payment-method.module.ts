import { Module } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PrismaPaymentMethodRepository } from '@infrastructure/database/prisma/repositories/prisma-payment-method.repository';

import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';

import { PaymentMethodController } from '@/interfaces/payments/controllers/payment-method.controller';

@Module({
  controllers: [PaymentMethodController],
  providers: [
    CreatePaymentMethodUseCase,
    {
      provide: PaymentMethodRepository,
      useClass: PrismaPaymentMethodRepository,
    },
  ],
})
export class PaymentMethodModule {}
