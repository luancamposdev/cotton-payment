import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { Password } from '@core/shared/value-objects/password';
import { Role } from '@core/users/entities/user.entity';
import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';

describe('Register user', () => {
  it('Should be able to register user', async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUser = new RegisterUser(userRepository);

    const password = Password.create('myPassword123');

    const { user } = await registerUser.execute({
      name: Name.create('Luan Campos'),
      email: Email.create('luancampos@mail.com'),
      avatarUrl: AvatarUrl.create('https://luancampos.png'),
      password,
      role: Role.CREATOR,
    });

    expect(user).toBeTruthy();
    expect(user.email.value).toBe('luancampos@mail.com');
    expect(user.name.value).toBe('Luan Campos');
    expect(user.role).toBe(Role.CREATOR);
    expect(user.passwordHash.value()).not.toBe('myPassword123');
  });

  it('Should not allow duplicate email', async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUser = new RegisterUser(userRepository);

    const password = Password.create('myPassword123');

    await registerUser.execute({
      name: Name.create('Luan Campos'),
      email: Email.create('luancampos@mail.com'),
      avatarUrl: AvatarUrl.create('https://luancampos.png'),
      password,
      role: Role.CREATOR,
    });

    await expect(
      registerUser.execute({
        name: Name.create('Outra Pessoa'),
        email: Email.create('luancampos@mail.com'),
        avatarUrl: AvatarUrl.create('https://example.com/avatar.png'),
        password: Password.create('anotherPass'),
        role: Role.CLIENT,
      }),
    ).rejects.toThrow('E-mail já está em uso');
  });
});
