import { Injectable } from '@nestjs/common';

import { CreateCreatorDto } from '../dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { FindCreatorByUserIdUseCase } from '@application/creator/use-case/find-creator-by-user-id.use-case';

@Injectable()
export class CreateCreatorsService {
  constructor(
    private readonly createCreatorUseCase: CreateCreatorUseCase,
    private readonly findCreatorByUserIdUseCase: FindCreatorByUserIdUseCase,
  ) {}

  async create(dto: CreateCreatorDto) {
    return this.createCreatorUseCase.execute(dto);
  }

  async findCreatorByUserId(userId: string): Promise<CreatorsEntity> {
    return this.findCreatorByUserIdUseCase.execute({ userId });
  }
}
