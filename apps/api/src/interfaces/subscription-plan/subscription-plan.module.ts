import { Module } from '@nestjs/common';

import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { PrismaSubscriptionPlanRepository } from '@infrastructure/database/prisma/repositories/prisma-subscription-plan.repository';

import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/create-subscription-plan.use-case';
import { FindSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/find-subscription-plan.use-case';
import { FindSubscriptionPlansByCreatorUseCase } from '@application/subscription-plan/use-cases/find-subscription-plan-by-creator.use-case';
import { UpdateSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/update-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from '@application/subscription-plan/use-cases/delete-subscription-plan.use-case';

import { SubscriptionPlanController } from '@/interfaces/subscription-plan/controller/subscription-plan.controller';

@Module({
  controllers: [SubscriptionPlanController],
  providers: [
    CreateSubscriptionPlanUseCase,
    FindSubscriptionPlanUseCase,
    FindSubscriptionPlansByCreatorUseCase,
    UpdateSubscriptionPlanUseCase,
    DeleteSubscriptionPlanUseCase,

    {
      provide: SubscriptionPlanRepository,
      useClass: PrismaSubscriptionPlanRepository,
    },
  ],
})
export class SubscriptionPlanModule {}
