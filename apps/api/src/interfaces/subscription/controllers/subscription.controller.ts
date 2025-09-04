import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';
import { SubscriptionViewModel } from '@/interfaces/subscription/subscription.view.model';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { SubscriptionPlanViewModel } from '@/interfaces/subscription-plan/subscription-plan.view.model';

import { FindSubscriptionByCustomerUseCase } from '@application/subscriptions/find-subscription-by-customer.use-case';
import { UpdateSubscriptionUseCase } from '@application/subscriptions/update-subscription.use-case';

import { CreateSubscriptionDto } from '@/interfaces/subscription/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '@/interfaces/subscription/dto/update-subscription.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly createSubscriptionRepository: CreateSubscriptionUseCase,
    private readonly findSubscriptionByCustomerUseCase: FindSubscriptionByCustomerUseCase,
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(@Body() dto: CreateSubscriptionDto) {
    const { subscription } =
      await this.createSubscriptionRepository.execute(dto);

    return SubscriptionViewModel.toHTTP(subscription);
  }

  @Get('customer/:customerId')
  @Roles(Role.CUSTOMER)
  async findByCreator(@Param('customerId') customerId: string) {
    const { subscriptions } =
      await this.findSubscriptionByCustomerUseCase.execute({ customerId });

    return subscriptions.map((subscription) =>
      SubscriptionViewModel.toHTTP(subscription),
    );
  }

  @Roles(Role.CUSTOMER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    const { subscription } = await this.updateSubscriptionUseCase.execute(
      id,
      dto,
    );
    return SubscriptionViewModel.toHTTP(subscription);
  }
}
