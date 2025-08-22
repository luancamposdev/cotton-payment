import { CreatorsEntity } from '@core/creators/entities/creators.entity';

export interface CreatorView {
  id: string;
  bio: string;
  socialLinks: string[];
}

export class CreatorViewModel {
  static toHTTP(creator: CreatorsEntity): CreatorView {
    return {
      id: creator.id,
      bio: creator.bio,
      socialLinks: creator.socialLinks.map((link) => link.value),
    };
  }
}
