import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { Password } from '@core/shared/value-objects/password';
import { Email } from '@core/shared/value-objects/email';
import { Name } from '@core/users/value-objects/name';
import { Role } from '@core/users/entities/user.entity';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { LoginUseCase } from '@application/auth/use-case/login.use-case';

describe('Login user', () => {
  it('Should authenticate a registered user with valid credentials', async () => {
    const repository = new InMemoryUserRepository();
    const register = new RegisterUser(repository);
    const login = new LoginUseCase(repository);

    const rawPassword = 'myPassword123';
    const email = Email.create('luancampos@mail.com');

    await register.execute({
      name: Name.create('Luan Campos'),
      email,
      avatarUrl: AvatarUrl.create('https://luancampos.png'),
      password: Password.create(rawPassword),
      role: Role.CREATOR,
    });

    const result = await login.execute({
      email,
      password: Password.create(rawPassword),
    });

    expect(result.user).toBeTruthy();
    expect(result.user.email.value).toBe(email.value);
  });
});
