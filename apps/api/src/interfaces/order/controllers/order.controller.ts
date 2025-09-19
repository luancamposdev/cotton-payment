import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';

import { CreateOrderDTO } from '@/interfaces/order/dto/create-order.dto';

import { OrderViewModel } from '@/interfaces/order/order.view.model';
import { FindOrderByIDUseCase } from '@application/order/use-cases/find-order-by-id.use-case';
import { FindOrderByCustomerIdUseCase } from '@application/order/use-cases/find-order-by-customer-id.use-case';
import { DeleteOrderUseCase } from '@application/order/use-cases/delete-order.use-case';
import { UpdateOrderUseCase } from '@application/order/use-cases/update-order.use-case';
import { UpdateOrderDTO } from '@/interfaces/order/dto/update-order.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIDUseCase,
    private readonly findOrderByCustomerId: FindOrderByCustomerIdUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(@Body() dto: CreateOrderDTO) {
    const { order } = await this.createOrderUseCase.execute({
      ...dto,
    });

    return OrderViewModel.toHTTP(order);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  async findById(@Param('id') id: string) {
    const { order } = await this.findOrderByIdUseCase.execute(id);

    return OrderViewModel.toHTTP(order);
  }

  @Get('customer/:customerId')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  async findByCustomerId(@Param('customerId') customerId: string) {
    const { orders } = await this.findOrderByCustomerId.execute(customerId);

    return orders.map((order) => OrderViewModel.toHTTP(order));
  }

  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDTO) {
    const { order } = await this.updateOrderUseCase.execute(id, dto);

    return OrderViewModel.toHTTP(order);
  }

  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.deleteOrderUseCase.excute(id);
    return { message: 'Pedido removido com sucesso.' };
  }
}
