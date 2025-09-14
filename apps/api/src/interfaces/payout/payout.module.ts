import { Module } from '@nestjs/common';

import { PayoutController } from '@/interfaces/payout/controllers/payout.controller';
import { CreatePayoutUseCase } from '@application/payout/use-cases/create-payout.use-case';

import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PrismaPayoutRepository } from '@infrastructure/database/prisma/repositories/prisma-payout.repository';

@Module({
  controllers: [PayoutController],
  providers: [
    CreatePayoutUseCase,
    {
      provide: PayoutRepository,
      useClass: PrismaPayoutRepository,
    },
  ],
})
export class PayoutModule {}
