import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('CreatorsEntity', () => {
  let creator: CreatorsEntity;

  beforeEach(() => {
    creator = new CreatorsEntity({
      userId: 'user-123',
      bio: 'Minha bio inicial',
      socialLinks: [],
    });
  });

  it('should create a creator with default values', () => {
    expect(creator.id).toBeDefined();
    expect(creator.userId).toBe('user-123');
    expect(creator.bio).toBe('Minha bio inicial');
    expect(creator.socialLinks).toHaveLength(0);
  });

  it('should update bio', () => {
    creator.updateBio('Nova bio');
    expect(creator.bio).toBe('Nova bio');
  });

  it('should not allow bio longer than 200 characters', () => {
    const longBio = 'a'.repeat(201);
    expect(() => creator.updateBio(longBio)).toThrow(
      'Bio cannot exceed 200 characters.',
    );
  });

  it('should add social link', () => {
    const link = new SocialLink('https://twitter.com/user');
    creator.addSocialLink(link);
    expect(creator.socialLinks).toHaveLength(1);
    expect(creator.socialLinks[0]).toEqual(link);
  });

  it('should not add duplicate social link', () => {
    const link = new SocialLink('https://twitter.com/user');
    creator.addSocialLink(link);
    creator.addSocialLink(link);
    expect(creator.socialLinks).toHaveLength(1);
  });

  it('should remove social link', () => {
    const link1 = new SocialLink('https://twitter.com/user1');
    const link2 = new SocialLink('https://twitter.com/user2');
    creator.addSocialLink(link1);
    creator.addSocialLink(link2);

    creator.removeSocialLink(link1);
    expect(creator.socialLinks).toHaveLength(1);
    expect(creator.socialLinks[0]).toEqual(link2);
  });

  it('should replace social links', () => {
    const link1 = new SocialLink('https://twitter.com/user1');
    const link2 = new SocialLink('https://twitter.com/user2');
    creator.replaceSocialLinks([link1, link2]);
    expect(creator.socialLinks).toHaveLength(2);
    expect(creator.socialLinks).toEqual([link1, link2]);
  });
});
