import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@infrastructure/auth/auth.service';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { Role } from '@core/users/entities/user.entity';
import { Password } from '@core/shared/value-objects/password';

describe('Register user', () => {
  let userRepository: InMemoryUserRepository;
  let authService: AuthService;
  let registerUser: RegisterUser;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({ secret: 'TESTE_SECRET_KEY' });
    authService = new AuthService(userRepository, jwtService);
    registerUser = new RegisterUser(userRepository, authService);
  });

  it('Should be able to register user', async () => {
    const { user } = await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      avatarUrl: 'https://luancampos.png',
      password: 'myPassword123',
    });

    expect(user).toBeDefined();
    expect(user.email.value).toBe('luancampos@mail.com');
    expect(user.name.value).toBe('Luan Campos');
    expect(user.role).toBe(Role.CLIENT);
    expect(
      await user.passwordHash.compare(Password.create('myPassword123')),
    ).toBeTruthy();
  });

  it('Should not allow duplicate email', async () => {
    await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      avatarUrl: 'https://luancampos.png',
      password: 'myPassword123',
    });

    await expect(
      registerUser.execute({
        name: 'Outra Pessoa',
        email: 'luancampos@mail.com',
        avatarUrl: 'https://example.com/avatar.png',
        password: 'anotherPass',
      }),
    ).rejects.toThrow('User already exists.');
  });
});
