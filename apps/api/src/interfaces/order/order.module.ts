import { Module } from '@nestjs/common';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';

import { OrderController } from '@/interfaces/order/controllers/order.controller';
import { OrderRepository } from '@core/Order/repository/order.repository';
import { PrismaOrderRepository } from '@infrastructure/database/prisma/repositories/prisma-order.repository';
import { CustomerModule } from '@/interfaces/customer/customer.module';

@Module({
  imports: [CustomerModule],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrderModule {}
