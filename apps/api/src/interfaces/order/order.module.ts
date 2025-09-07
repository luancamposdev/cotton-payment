import { Module } from '@nestjs/common';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';

import { OrderController } from '@/interfaces/order/controllers/order.controller';
import { OrderRepository } from '@core/Order/repository/order.repository';
import { PrismaOrderRepository } from '@infrastructure/database/prisma/repositories/prisma-order.repository';
import { CustomerModule } from '@/interfaces/customer/customer.module';
import { FindOrderByIDUseCase } from '@application/order/use-cases/find-order-by-id.use-case';
import { FindOrderByCustomerIdUseCase } from '@application/order/use-cases/find-order-by-customer-id.use-case';
import { DeleteOrderUseCase } from '@application/order/use-cases/delete-order.use-case';
import { UpdateOrderUseCase } from '@application/order/use-cases/update-order.use-case';

@Module({
  imports: [CustomerModule],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    FindOrderByIDUseCase,
    FindOrderByCustomerIdUseCase,
    UpdateOrderUseCase,
    DeleteOrderUseCase,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrderModule {}
