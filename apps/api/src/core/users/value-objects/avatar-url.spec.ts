import { AvatarUrl } from './avatar-url';

describe('AvatarURL', () => {
  it('should create a valid avatar with HTTPS URL', () => {
    const url = 'https://github.com/luancamposdev';
    const avatarUrl = AvatarUrl.create(url);

    expect(avatarUrl).toBeInstanceOf(AvatarUrl);
    expect(avatarUrl.getValue()).toBe(url);
  });

  it('Should throw an error if the avatar URl is an empty string', () => {
    expect(() => AvatarUrl.create('')).toThrow('Invalid avatar URL');
  });

  it('Should throw an error if the URL is not valid', () => {
    const invalidUrl = 'not-a-url';
    expect(() => AvatarUrl.create(invalidUrl)).toThrow('Invalid avatar URL');
  });

  it('should throw an error if the URL does not start with http or https', () => {
    const invalidUrl = 'ftp://example.com/avatar.png';
    expect(() => AvatarUrl.create(invalidUrl)).toThrow('Invalid avatar URL');
  });

  it('should trim whitespace from the URL', () => {
    const urlWithSpaces = '  https://cdn.com/avatar.jpg  ';
    const avatar = AvatarUrl.create(urlWithSpaces);

    expect(avatar.getValue()).toBe('https://cdn.com/avatar.jpg');
  });
});
