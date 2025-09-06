import { Module } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PrismaPaymentMethodRepository } from '@infrastructure/database/prisma/repositories/prisma-payment-method.repository';

import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';

import { PaymentMethodController } from '@/interfaces/payments/controllers/payment-method.controller';
import { FindPaymentMethodByIdUseCase } from '@application/payments/use-cases/find-payment-method-by-id.use-case';
import { FindPaymentMethodsByCustomerUseCase } from '@application/payments/use-cases/find-payment-methods-by-customer.use-case';

@Module({
  controllers: [PaymentMethodController],
  providers: [
    CreatePaymentMethodUseCase,
    FindPaymentMethodByIdUseCase,
    FindPaymentMethodsByCustomerUseCase,
    {
      provide: PaymentMethodRepository,
      useClass: PrismaPaymentMethodRepository,
    },
  ],
})
export class PaymentMethodModule {}
