import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CreateSubscriptionDto } from '@/interfaces/subscription/dto/create-subscription.dto';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';
import { SubscriptionViewModel } from '@/interfaces/subscription/subscription.view.model';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly createSubscriptionRepository: CreateSubscriptionUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(@Body() dto: CreateSubscriptionDto) {
    const { subscription } =
      await this.createSubscriptionRepository.execute(dto);

    return SubscriptionViewModel.toHTTP(subscription);
  }
}
