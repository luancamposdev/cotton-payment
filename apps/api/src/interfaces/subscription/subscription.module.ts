import { Module } from '@nestjs/common';

import { SubscriptionController } from '@/interfaces/subscription/controllers/subscription.controller';
import { CreateSubscriptionUseCase } from '@application/subscriptions/create-subscriptions.use-case';

// Repositories abstratos
import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

// Prisma implementations
import { PrismaSubscriptionRepository } from '@infrastructure/database/prisma/repositories/prisma-subscription.repository';
import { PrismaCustomerRepository } from '@infrastructure/database/prisma/repositories/prisma-customer.repository';
import { PrismaSubscriptionPlanRepository } from '@infrastructure/database/prisma/repositories/prisma-subscription-plan.repository';

@Module({
  controllers: [SubscriptionController],
  providers: [
    CreateSubscriptionUseCase,
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
  exports: [CreateSubscriptionUseCase],
})
export class SubscriptionModule {}
