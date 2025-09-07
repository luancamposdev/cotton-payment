import { Body, Controller, Post, UseGuards, Param } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';

import { CreateOrderDTO } from '@/interfaces/order/dto/create-order.dto';

import { OrderViewModel } from '@/interfaces/order/order.view.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  async create(@Body() dto: CreateOrderDTO, @Param('id') id: string) {
    const { order } = await this.createOrderUseCase.execute({
      ...dto,
      customerId: id,
    });

    return OrderViewModel.toHTTP(order);
  }
}
