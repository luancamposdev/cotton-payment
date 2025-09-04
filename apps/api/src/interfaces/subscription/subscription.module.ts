import { Module } from '@nestjs/common';

import { SubscriptionController } from '@/interfaces/subscription/controllers/subscription.controller';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';

import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

import { PrismaSubscriptionRepository } from '@infrastructure/database/prisma/repositories/prisma-subscription.repository';
import { PrismaCustomerRepository } from '@infrastructure/database/prisma/repositories/prisma-customer.repository';
import { PrismaSubscriptionPlanRepository } from '@infrastructure/database/prisma/repositories/prisma-subscription-plan.repository';
import { FindSubscriptionByCustomerUseCase } from '@application/subscriptions/find-subscription-by-customer.use-case';
import { UpdateSubscriptionUseCase } from '@application/subscriptions/update-subscription.use-case';
import { CancelSubscriptionUseCase } from '@application/subscriptions/cancel-subscription.use-case';

@Module({
  controllers: [SubscriptionController],
  providers: [
    CreateSubscriptionUseCase,
    FindSubscriptionByCustomerUseCase,
    UpdateSubscriptionUseCase,
    CancelSubscriptionUseCase,
    {
      provide: SubscriptionRepository,
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: SubscriptionPlanRepository,
      useClass: PrismaSubscriptionPlanRepository,
    },
  ],
  exports: [CreateSubscriptionUseCase, FindSubscriptionByCustomerUseCase],
})
export class SubscriptionModule {}
