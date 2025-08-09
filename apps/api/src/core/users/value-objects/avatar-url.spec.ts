import { AvatarUrl } from './avatar-url';

describe('AvatarURL', () => {
  it('should create a valid avatar with HTTPS URL', () => {
    const url = 'https://github.com/luancamposdev';
    const avatarUrl = AvatarUrl.create(url);

    expect(avatarUrl).toBeInstanceOf(AvatarUrl);
    expect(avatarUrl?.value).toBe(url);
  });

  it('should trim whitespace from the URL', () => {
    const urlWithSpaces = '  https://cdn.com/avatar.jpg  ';
    const avatar = AvatarUrl.create(urlWithSpaces);

    expect(avatar?.value).toBe('https://cdn.com/avatar.jpg');
  });
});
