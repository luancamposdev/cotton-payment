import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';

import { Role, UserEntity } from '@core/users/entities/user.entity';

import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { UpdateCustomerUseCase } from '@application/customer/use-case/update-customer.use-case';
import { FindCustomerByUserIdUseCase } from '@application/customer/use-case/find-customer-by-user-id.use-case';

import { CreateCustomerDto } from '@/interfaces/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/interfaces/customer/dto/update.customer.dto';

import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';

import {
  CustomerView,
  CustomerViewModel,
} from '@/interfaces/customer/customer.view.model';
import { FindCustomerByIdUseCase } from '@application/customer/use-case/find-customer-by-id.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly findCustomerByUserIdUseCase: FindCustomerByUserIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CustomerView> {
    dto.userId = user.id;
    const { customer } = await this.createCustomerUseCase.execute(dto);

    return CustomerViewModel.toHTTP(customer);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER)
  async findById(@Param('id') id: string): Promise<CustomerView> {
    const { customer } = await this.findCustomerByIdUseCase.execute({ id });

    return CustomerViewModel.toHTTP(customer);
  }

  @Get()
  @Roles(Role.CUSTOMER)
  async findByUserId(@CurrentUser() user: UserEntity): Promise<CustomerView> {
    const { customer } = await this.findCustomerByUserIdUseCase.execute({
      userId: user.id,
    });

    return CustomerViewModel.toHTTP(customer);
  }

  @Patch()
  @Roles(Role.CUSTOMER)
  async update(
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CustomerView> {
    const { customer } = await this.updateCustomerUseCase.execute({
      userId: user.id,
      dto,
    });

    return CustomerViewModel.toHTTP(customer);
  }
}
