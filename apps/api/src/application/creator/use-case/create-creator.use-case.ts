import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { CreateCreatorDto } from '@/creators/dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateCreatorUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}

  async execute(dto: CreateCreatorDto): Promise<CreatorsEntity> {
    const existing = await this.creatorRepository.findByUserId(dto.userId);

    if (existing) {
      throw new ConflictException('Creator já cadastrado para este usuário');
    }

    const creator = new CreatorsEntity({
      userId: dto.userId,
      bio: dto.bio,
      socialLinks: dto.socialLinks ?? [],
    });

    await this.creatorRepository.create(creator);

    return creator;
  }
}
