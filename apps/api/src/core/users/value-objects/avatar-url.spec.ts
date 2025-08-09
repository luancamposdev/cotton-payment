import { AvatarUrl } from './avatar-url';
import { Name } from '@core/users/value-objects/name';

describe('AvatarURL', () => {
  it('should create a valid avatar with HTTPS URL', () => {
    const url = 'https://github.com/luancamposdev';
    const name = Name.create('Luan Campos').value;
    const avatarUrl = AvatarUrl.create(url, name);

    expect(avatarUrl).toBeInstanceOf(AvatarUrl);
    expect(avatarUrl.value).toBe(url);
  });

  it('should trim whitespace from the URL', () => {
    const urlWithSpaces = '  https://cdn.com/avatar.jpg  ';
    const name = Name.create('Luan Campos').value;
    const avatar = AvatarUrl.create(urlWithSpaces, name);

    expect(avatar.value).toBe('https://cdn.com/avatar.jpg');
  });
});
