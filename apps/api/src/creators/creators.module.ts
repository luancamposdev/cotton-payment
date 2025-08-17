import { Module } from '@nestjs/common';

import { CreatorsController } from '@/creators/controllers/creators.controller';
import { CreateCreatorsService } from '@/creators/services/creators.service';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { FindCreatorByIdUseCase } from '@application/creator/use-case/find-creator-by-id.use-case';
import { PrismaCreatorRepository } from '@infrastructure/database/prisma/repositories/prisma-creator.repository';

@Module({
  controllers: [CreatorsController],
  providers: [
    CreateCreatorsService,
    CreateCreatorUseCase,
    FindCreatorByIdUseCase,
    {
      provide: CreatorRepository,
      useClass: PrismaCreatorRepository,
    },
  ],
  exports: [CreateCreatorsService],
})
export class CreatorsModule {}
