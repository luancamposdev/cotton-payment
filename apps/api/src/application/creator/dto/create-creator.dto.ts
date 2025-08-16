import { SocialLink } from '@core/creators/value-objects/social-link.vo';

export interface CreateCreatorDto {
  userId: string;
  bio?: string;
  socialLinks?: SocialLink[];
}
