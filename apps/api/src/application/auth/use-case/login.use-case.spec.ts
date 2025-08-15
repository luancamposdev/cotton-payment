import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@infrastructure/auth/auth.service';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { LoginUseCase } from '@application/auth/use-case/login.use-case';
import { TokenBlacklistService } from '@infrastructure/auth/token-blacklist.service';
import { InvalidCredentialsError } from '@/application/auth/use-case/Errors/InvalidCredentialsError';
import { Role } from '@core/users/entities/user.entity';

describe('AuthService (integration-ish)', () => {
  let userRepository: InMemoryUserRepository;
  let jwtService: JwtService;
  let authService: AuthService;
  let registerUser: RegisterUser;
  let tokenBlacklistService: TokenBlacklistService;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({ secret: 'TESTE_SECRET_KEY' });
    tokenBlacklistService = new TokenBlacklistService();
    authService = new AuthService(
      userRepository,
      jwtService,
      tokenBlacklistService,
    );
    registerUser = new RegisterUser(userRepository, authService);
    loginUseCase = new LoginUseCase(userRepository, jwtService);
  });

  it('Should be able authenticate with valid credentials', async () => {
    await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      avatarUrl: 'https://github.com/luancamposdev.png',
      password: 'myPassword123',
      role: Role.CUSTOMER,
    });

    const result = await authService.validateCredentials(
      'luancampos@mail.com',
      'myPassword123',
    );

    expect(result).toBeDefined();
    expect(result!.email.value).toBe('luancampos@mail.com');
  });

  it('Should throw InvalidCredentialsError with invalid password', async () => {
    await registerUser.execute({
      name: 'Luan Campos',
      email: 'luan@mail.com',
      avatarUrl: 'https://github.com/luancamposdev.png',
      password: 'myPassword123',
      role: Role.CUSTOMER,
    });

    const result = loginUseCase.execute({
      email: 'luan@mail.com',
      password: 'wrongPass',
    });

    await expect(result).rejects.toThrow(InvalidCredentialsError);
  });

  it('loginUseCase returns token and user', async () => {
    await registerUser.execute({
      name: 'Luan Campos',
      email: 'luanzinho@mail.com',
      avatarUrl: 'https://github.com/luancamposdev.png',
      password: 'myPassword123',
      role: Role.CUSTOMER,
    });

    jest.spyOn(jwtService, 'sign').mockReturnValue('fixed-token');

    const { user: logged, token } = await loginUseCase.execute({
      email: 'luanzinho@mail.com',
      password: 'myPassword123',
    });

    expect(logged).toBeDefined();
    expect(token).toBe('fixed-token');
  });
});
