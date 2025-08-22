import { Module } from '@nestjs/common';

import { CreatorsController } from '@/interfaces/creators/controllers/creators.controller';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { FindCreatorByUserIdUseCase } from '@application/creator/use-case/find-creator-by-user-id.use-case';
import { PrismaCreatorRepository } from '@infrastructure/database/prisma/repositories/prisma-creator.repository';

@Module({
  controllers: [CreatorsController],
  providers: [
    CreateCreatorUseCase,
    FindCreatorByUserIdUseCase,
    {
      provide: CreatorRepository,
      useClass: PrismaCreatorRepository,
    },
  ],
})
export class CreatorsModule {}
