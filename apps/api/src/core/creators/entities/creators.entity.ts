import { randomUUID } from 'node:crypto';

import { SocialLink } from '@core/creators/value-objects/social-link.vo';
import { Replace } from '@helpers/replace';

export interface ICreator {
  userId: string;
  bio: string;
  socialLinks: SocialLink[];
}

export class CreatorsEntity {
  private readonly _id: string;
  private props: ICreator;

  constructor(
    props: Replace<ICreator, { bio?: string; socialLinks: SocialLink[] }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      bio: props.bio ?? '',
      socialLinks: props.socialLinks ?? [],
    };
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get bio(): string {
    return this.props.bio;
  }

  public get socialLinks(): ReadonlyArray<SocialLink> {
    return [...this.props.socialLinks];
  }

  public updateBio(newBio: string): void {
    if (newBio.length > 200) {
      throw new Error('Bio cannot exceed 200 characters.');
    }
    this.props.bio = newBio;
  }

  public addSocialLink(link: SocialLink): void {
    if (!this.props.socialLinks.some((l) => l.equals(link))) {
      this.props.socialLinks.push(link);
    }
  }

  public removeSocialLink(link: SocialLink): void {
    this.props.socialLinks = this.props.socialLinks.filter(
      (l) => !l.equals(link),
    );
  }

  public replaceSocialLinks(links: SocialLink[]): void {
    this.props.socialLinks = links;
  }
}
