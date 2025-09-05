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

import { DeleteSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/delete-subscription-plan.use-case';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/create-subscription-plan.use-case';
import { FindSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/find-subscription-plan.use-case';
import { FindSubscriptionPlansByCreatorUseCase } from '@application/subscription-plan/use-cases/find-subscription-plan-by-creator.use-case';
import { UpdateSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/update-subscription-plan.use-case';

import { CreateSubscriptionPlanDto } from '@/interfaces/subscription-plan/dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '@/interfaces/subscription-plan/dto/update-subscription-plan.dto';

import { SubscriptionPlanViewModel } from '@/interfaces/subscription-plan/subscription-plan.view.model';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(
    private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    private readonly findSubscriptionPlanUseCase: FindSubscriptionPlanUseCase,
    private readonly findSubscriptionPlansByCreatorUseCase: FindSubscriptionPlansByCreatorUseCase,
    private readonly updateSubscriptionPlanUseCase: UpdateSubscriptionPlanUseCase,
    private readonly deleteSubscriptionPlanUseCase: DeleteSubscriptionPlanUseCase,
  ) {}

  @Post()
  @Roles(Role.CREATOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSubscriptionPlanDto) {
    const { subscriptionPlan } =
      await this.createSubscriptionPlanUseCase.execute(dto);

    return SubscriptionPlanViewModel.toHTTP(subscriptionPlan);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const { subscriptionPlan } = await this.findSubscriptionPlanUseCase.execute(
      { id },
    );
    return SubscriptionPlanViewModel.toHTTP(subscriptionPlan);
  }

  @Get('creator/:creatorId')
  async findByCreator(@Param('creatorId') creatorId: string) {
    const { subscriptionPlans } =
      await this.findSubscriptionPlansByCreatorUseCase.execute({ creatorId });

    return subscriptionPlans.map((subscriptionPlan) =>
      SubscriptionPlanViewModel.toHTTP(subscriptionPlan),
    );
  }

  @Patch(':id')
  @Roles(Role.CREATOR, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ) {
    const { subscriptionPlan } =
      await this.updateSubscriptionPlanUseCase.execute(id, dto);

    return SubscriptionPlanViewModel.toHTTP(subscriptionPlan);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteSubscriptionPlanUseCase.execute({ id });
  }
}
