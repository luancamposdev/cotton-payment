import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { CreateCreatorDto } from '@application/creator/dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/creators.entity';

export class CreateCreatorUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}

  async execute(dto: CreateCreatorDto): Promise<CreatorsEntity> {
    const existing = await this.creatorRepository.findByUserId(dto.userId);

    if (existing) {
      throw new Error('Creator já cadastrado para este usuário');
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
