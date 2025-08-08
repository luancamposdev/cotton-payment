import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@/infrastructure/auth/auth.service';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Password } from '@core/shared/value-objects/password';
import { Role } from '@core/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService (integration-ish)', () => {
  const userRepository = new InMemoryUserRepository();
  const jwtService = new JwtService({});
  const authService = new AuthService(userRepository, jwtService);
  const registerUser = new RegisterUser(userRepository);

  it('Should be able authenticate with valid credentials', async () => {
    const password = Password.create('myPassword123');

    await registerUser.execute({
      name: Name.create('Luan Campos'),
      email: Email.create('luancampos@mail.com'),
      avatarUrl: AvatarUrl.create('https://github.com/luancamposdev.png'),
      password,
      role: Role.CLIENT,
    });

    const result = await authService.validateCredentials(
      'luancampos@mail.com',
      password.value(),
    );

    expect(result).toBeDefined();
    expect(result!.email.value).toBe('luancampos@mail.com');
  });

  it('Should be able invalid password even after registration', async () => {
    const password = Password.create('myPassword123');

    await registerUser.execute({
      name: Name.create('Luan Campos'),
      email: Email.create('luan@mail.com'),
      avatarUrl: AvatarUrl.create('https://github.com/luancamposdev.png'),
      password,
      role: Role.CLIENT,
    });

    const result = authService.loginWithCredentials(
      'luan@mail.com',
      'wrongPass',
    );

    await expect(result).rejects.toThrow(UnauthorizedException);
  });

  it('loginWithCredentials returns token and user', async () => {
    const password = Password.create('myPassword123');

    await registerUser.execute({
      name: Name.create('Luan Campos'),
      email: Email.create('luanzinho@mail.com'),
      avatarUrl: AvatarUrl.create('https://github.com/luancamposdev.png'),
      password,
      role: Role.CLIENT,
    });

    jest.spyOn(jwtService, 'sign').mockReturnValue('fixed-token');

    const { user: logged, access_token } =
      await authService.loginWithCredentials(
        'luanzinho@mail.com',
        password.value(),
      );

    expect(logged).toBeDefined();
    expect(access_token).toBe('fixed-token');
  });
});
