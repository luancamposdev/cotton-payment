import { Module } from '@nestjs/common';

import { PaymentMethodRepository } from '@core/payments/repositories/payment-method.repository';
import { PrismaPaymentMethodRepository } from '@infrastructure/database/prisma/repositories/prisma-payment-method.repository';

import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';

import { PaymentMethodController } from '@/interfaces/payments/controllers/payment-method.controller';
import { FindPaymentMethodByIdUseCase } from '@application/payments/use-cases/find-payment-method-by-id.use-case';
import { FindPaymentMethodsByCustomerUseCase } from '@application/payments/use-cases/find-payment-methods-by-customer.use-case';
import { UpdatePaymentMethodUseCase } from '@application/payments/use-cases/update-payment-method.use-case';
import { DeletePaymentMethodUseCase } from '@application/payments/use-cases/delete-payment-method.use-case';
import { FindCustomerByUserIdUseCase } from '@application/customer/use-cases/find-customer-by-user-id.use-case';

@Module({
  controllers: [PaymentMethodController],
  providers: [
    CreatePaymentMethodUseCase,
    FindPaymentMethodByIdUseCase,
    FindPaymentMethodsByCustomerUseCase,
    UpdatePaymentMethodUseCase,
    DeletePaymentMethodUseCase,
    FindCustomerByUserIdUseCase,

    {
      provide: PaymentMethodRepository,
      useClass: PrismaPaymentMethodRepository,
    },
  ],
})
export class PaymentMethodModule {}
