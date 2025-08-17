import { Injectable } from '@nestjs/common';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { CreateCreatorDto } from '../dto/create-creator.dto';
import { FindCreatorByIdUseCase } from '@application/creator/use-case/find-creator-by-id.use-case';
import { CreatorsEntity } from '@core/creators/creators.entity';

@Injectable()
export class CreateCreatorsService {
  constructor(
    private readonly createCreatorUseCase: CreateCreatorUseCase,
    private readonly findCreatorById: FindCreatorByIdUseCase,
  ) {}

  async create(dto: CreateCreatorDto) {
    return this.createCreatorUseCase.execute(dto);
  }

  async findById(id: string): Promise<CreatorsEntity> {
    return this.findCreatorById.execute(id);
  }
}
