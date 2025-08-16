import { Module } from '@nestjs/common';
import { CreatorsController } from '@/creators/controllers/creators.controller';
import { CreateCreatorsService } from '@/creators/services/creators.service';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { InMemoryCreatorRepository } from '@test/in-memory-creator.repository';

@Module({
  controllers: [CreatorsController],
  providers: [
    CreateCreatorsService,
    CreateCreatorUseCase,
    {
      provide: CreatorRepository,
      useClass: InMemoryCreatorRepository,
    },
  ],
  exports: [CreateCreatorsService],
})
export class CreatorsModule {}
