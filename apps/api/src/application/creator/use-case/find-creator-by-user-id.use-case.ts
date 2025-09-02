import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

interface FindCreatorByUserIdRequest {
  userId: string;
}

@Injectable()
export class FindCreatorByUserIdUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}
  async execute({
    userId,
  }: FindCreatorByUserIdRequest): Promise<{ creator: CreatorsEntity }> {
    const creator = await this.creatorRepository.findByUserId(userId);

    if (!creator)
      throw new NotFoundException(
        `Não foi encontrado o criador para o id ${userId}`,
      );

    return { creator };
  }
}
