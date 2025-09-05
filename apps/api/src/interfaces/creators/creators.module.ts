import { Module } from '@nestjs/common';

import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { PrismaCreatorRepository } from '@infrastructure/database/prisma/repositories/prisma-creator.repository';

import { CreateCreatorUseCase } from '@application/creator/use-cases/create-creator.use-case';
import { FindCreatorByUserIdUseCase } from '@application/creator/use-cases/find-creator-by-user-id.use-case';
import { UpdateCreatorUseCase } from '@application/creator/use-cases/update-creator.use-case';

import { CreatorsController } from '@/interfaces/creators/controllers/creators.controller';

@Module({
  controllers: [CreatorsController],
  providers: [
    CreateCreatorUseCase,
    UpdateCreatorUseCase,
    FindCreatorByUserIdUseCase,
    {
      provide: CreatorRepository,
      useClass: PrismaCreatorRepository,
    },
  ],
})
export class CreatorsModule {}
