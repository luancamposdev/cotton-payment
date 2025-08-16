import { Injectable } from '@nestjs/common';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { CreateCreatorDto } from '../dto/create-creator.dto';

@Injectable()
export class CreateCreatorsService {
  constructor(private readonly createCreatorUseCase: CreateCreatorUseCase) {}

  create(dto: CreateCreatorDto) {
    return this.createCreatorUseCase.execute(dto);
  }
}
