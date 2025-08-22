import { CreatorSocialLink as RawSocialLink } from '@prisma/client';
import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';
import { Injectable } from '@nestjs/common';

type RawCreatorWithLinks = {
  id: string;
  userId: string;
  bio: string;
  socialLinks?: RawSocialLink[];
};

@Injectable()
export class PrismaCreatorMapper {
  static toPrisma(entity: CreatorsEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      bio: entity.bio,
      socialLinks: {
        create: entity.socialLinks
          .filter((link) => link.provider && link.value)
          .map((link) => ({
            provider: link.provider,
            url: link.value,
          })),
      },
    };
  }

  static toDomain(raw: RawCreatorWithLinks): CreatorsEntity {
    return new CreatorsEntity(
      {
        userId: raw.userId,
        bio: raw.bio,
        socialLinks: raw.socialLinks
          ? raw.socialLinks.map((sl) => new SocialLink(sl.url))
          : [],
      },
      raw.id,
    );
  }
}
