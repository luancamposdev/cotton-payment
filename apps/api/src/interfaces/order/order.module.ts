import { Module } from '@nestjs/common';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';

import { OrderController } from '@/interfaces/order/controllers/order.controller';
import { OrderRepository } from '@core/Order/repository/order.repository';
import { PrismaOrderRepository } from '@infrastructure/database/prisma/repositories/prisma-order.repository';
import { CustomerModule } from '@/interfaces/customer/customer.module';
import { FindOrderByIDUseCase } from '@application/order/use-cases/find-order-by-id.use-case';

@Module({
  imports: [CustomerModule],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    FindOrderByIDUseCase,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrderModule {}
