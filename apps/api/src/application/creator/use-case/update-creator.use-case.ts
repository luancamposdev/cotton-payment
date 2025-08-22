import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { NotFoundException } from '@nestjs/common';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

interface IUpdateCreatorRequest {
  userId: string;
  bio?: string;
  socialLinks?: string[];
}

export class UpdateCreatorUseCase {
  constructor(private readonly creatorRepository: CreatorRepository) {}
  async execute({
    userId,
    bio,
    socialLinks,
  }: IUpdateCreatorRequest): Promise<{ creator: CreatorsEntity }> {
    const creator = await this.creatorRepository.findByUserId(userId);

    if (!creator) {
      throw new NotFoundException(`Creator with userId ${userId} not found`);
    }

    if (!creator) {
      throw new NotFoundException('Creator not found for this user.');
    }

    if (bio !== undefined) {
      creator.bio = bio;
    }

    if (socialLinks) {
      creator.socialLinks.forEach((link) => creator.removeSocialLink(link));

      socialLinks.forEach((url) => creator.addSocialLink(new SocialLink(url)));
    }

    await this.creatorRepository.save(creator);

    return { creator };
  }
}
