import { Module } from '@nestjs/common';
import { SubscriptionPlanController } from '@/interfaces/subscription-plan/controller/subscription-plan.controller';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/create-subscription-plan.use-case';
import { FindSubscriptionPlanUseCase } from '@application/subscription-plan/find-subscription-plan.use-case';
import { FindSubscriptionPlansByCreatorUseCase } from '@application/subscription-plan/find-subscription-plan-by-creator.use-case';
import { UpdateSubscriptionPlanUseCase } from '@application/subscription-plan/update-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from '@application/subscription-plan/delete-subscription-plan.use-case';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { PrismaSubscriptionPlanRepository } from '@infrastructure/database/prisma/repositories/prisma-subscription-plan.repository';

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
