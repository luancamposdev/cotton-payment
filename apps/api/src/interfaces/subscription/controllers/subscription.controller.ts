import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateSubscriptionUseCase } from '@application/subscriptions/use-cases/create-subscriptions.use-case';
import { SubscriptionViewModel } from '@/interfaces/subscription/subscription.view.model';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { FindSubscriptionByCustomerUseCase } from '@application/subscriptions/use-cases/find-subscription-by-customer.use-case';
import { UpdateSubscriptionUseCase } from '@application/subscriptions/use-cases/update-subscription.use-case';

import { CreateSubscriptionDto } from '@/interfaces/subscription/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '@/interfaces/subscription/dto/update-subscription.dto';
import { CancelSubscriptionUseCase } from '@application/subscriptions/use-cases/cancel-subscription.use-case';
import { FindSubscriptionByIdUseCase } from '@application/subscriptions/use-cases/find-subscription-by-id.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly createSubscriptionRepository: CreateSubscriptionUseCase,
    private readonly findSubscriptionByIdUseCase: FindSubscriptionByIdUseCase,
    private readonly findSubscriptionByCustomerUseCase: FindSubscriptionByCustomerUseCase,
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(@Body() dto: CreateSubscriptionDto) {
    const { subscription } =
      await this.createSubscriptionRepository.execute(dto);

    return SubscriptionViewModel.toHTTP(subscription);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  async findById(@Param('id') id: string) {
    const { subscription } = await this.findSubscriptionByIdUseCase.execute({
      id,
    });

    return subscription;
  }

  @Get('customer/:customerId')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  async findByCustomer(@Param('customerId') customerId: string) {
    const { subscriptions } =
      await this.findSubscriptionByCustomerUseCase.execute({ customerId });

    return subscriptions.map((subscription) =>
      SubscriptionViewModel.toHTTP(subscription),
    );
  }

  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    const { subscription } = await this.updateSubscriptionUseCase.execute(
      id,
      dto,
    );
    return SubscriptionViewModel.toHTTP(subscription);
  }

  @Delete(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@Param('id') id: string) {
    await this.cancelSubscriptionUseCase.execute(id);
  }
}
