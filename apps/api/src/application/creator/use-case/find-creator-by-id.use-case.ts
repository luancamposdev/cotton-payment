import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

export interface IFindCreatorByUserIdRequest {
  id: string;
}

@Injectable()
export class FindCreatorByIdUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}

  async execute(id: string): Promise<CreatorsEntity> {
    const creator = await this.creatorRepository.findById(id);

    if (!creator) {
      throw new NotFoundException(
        'Usuário criador de conteúdo não encontrado.',
      );
    }

    return creator;
  }
}
