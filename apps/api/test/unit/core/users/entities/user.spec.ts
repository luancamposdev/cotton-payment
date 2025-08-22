import { Role, UserEntity } from '@core/users/entities/user.entity';

import { Password } from '@core/users/value-objects/password';
import { PasswordHash } from '@core/users/value-objects/password-hash';
import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrlVo } from '@core/users/value-objects/avatar-url.vo';

describe('UserEntity', () => {
  it('Should be able to create user', async () => {
    const password = Password.create('myPassword123');
    const hash = await PasswordHash.fromPassword(password);

    const user = new UserEntity({
      name: Name.create('Luan Campos'),
      email: Email.create('luancampos@mail.com'),
      avatarUrl: AvatarUrlVo.create('https://github.com/luancamposdev.png'),
      passwordHash: hash,
      role: Role.CUSTOMER,
    });

    expect(user).toBeTruthy();
    expect(user.name.value).toBe('Luan Campos');
    expect(user.email.value).toBe('luancampos@mail.com');
    expect(user.avatarUrl?.value).toBe('https://github.com/luancamposdev.png');
    expect(await user.passwordHash.compare(password)).toBe(true);
    expect(user.role).toBe(Role.CUSTOMER);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.deleteAccountAt).toBeUndefined();
  });

  it('should allow updating the avatar URL', async () => {
    const password = Password.create('UpdateAvatar123');
    const hash = await PasswordHash.fromPassword(password);

    const user = new UserEntity({
      name: Name.create('Luan Campos'),
      email: Email.create('luancampos@mail.com'),
      avatarUrl: AvatarUrlVo.create('https://github.com/luancamposdev.png'),
      passwordHash: hash,
      role: Role.CUSTOMER,
    });

    user.avatarUrl = AvatarUrlVo.create(
      'https://cdn.example.com/luancampos.png',
    );

    if (!user.avatarUrl) return;

    expect(user.avatarUrl.value).toBe('https://cdn.example.com/luancampos.png');
  });
});
