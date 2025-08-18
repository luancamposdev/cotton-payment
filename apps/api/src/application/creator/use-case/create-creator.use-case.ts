import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { CreateCreatorDto } from '@/creators/dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

@Injectable()
export class CreateCreatorUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}

  async execute(dto: CreateCreatorDto): Promise<CreatorsEntity> {
    const existing = await this.creatorRepository.findByUserId(dto.userId);

    if (existing) {
      throw new ConflictException('Creator já cadastrado para este usuário');
    }

    const socialLinksVO: SocialLink[] = (dto.socialLinks ?? []).map(
      (url) => new SocialLink(url),
    );

    const creator = new CreatorsEntity({
      userId: dto.userId,
      bio: dto.bio,
      socialLinks: socialLinksVO,
    });

    await this.creatorRepository.create(creator);

    return creator;
  }
}
