import { AvatarUrlVo } from '@core/users/value-objects/avatar-url.vo';

describe('AvatarURL', () => {
  it('should create a valid avatar with HTTPS URL', () => {
    const url = 'https://github.com/luancamposdev';
    const avatarUrl = AvatarUrlVo.create(url);

    expect(avatarUrl).toBeInstanceOf(AvatarUrlVo);
    expect(avatarUrl?.value).toBe(url);
  });

  it('should trim whitespace from the URL', () => {
    const urlWithSpaces = '  https://cdn.com/avatar.jpg  ';
    const avatar = AvatarUrlVo.create(urlWithSpaces);

    expect(avatar?.value).toBe('https://cdn.com/avatar.jpg');
  });
});
