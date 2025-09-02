import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { UpdateCreatorDto } from '@/interfaces/creators/dto/update.creator.dto';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

@Injectable()
export class UpdateCreatorUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}
  async execute({
    userId,
    dto,
  }: {
    userId: string;
    dto: UpdateCreatorDto;
  }): Promise<{ creator: CreatorsEntity }> {
    const creator = await this.creatorRepository.findByUserId(userId);

    if (!creator) {
      throw new NotFoundException('Criador não encontrado para este usuário.');
    }

    if (dto.bio !== undefined) {
      creator.updateBio(dto.bio);
    }

    if (dto.socialLinks !== undefined && dto.socialLinks.length > 0) {
      const links = dto.socialLinks.map((url) => new SocialLink(url));
      creator.replaceSocialLinks(links);
    }

    await this.creatorRepository.save(creator);

    return { creator };
  }
}
