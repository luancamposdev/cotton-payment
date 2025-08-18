import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@/auth/services/auth.service';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { LoginUseCase } from '@application/auth/use-case/login.use-case';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { TokenBlacklistService } from '@/auth/services/token-blacklist.service';
import { InvalidCredentialsError } from '@application/auth/use-case/errors/InvalidCredentialsError';

describe('AuthService (integration-ish)', () => {
  let jwtService: JwtService;
  let authService: AuthService;
  let registerUser: RegisterUser;
  let loginUseCase: LoginUseCase;
  let registeredUser: UserEntity;
  let tokenBlacklistService: TokenBlacklistService;

  beforeEach(async () => {
    const userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({ secret: 'TESTE_SECRET_KEY' });
    tokenBlacklistService = new TokenBlacklistService();
    authService = new AuthService(
      userRepository,
      jwtService,
      tokenBlacklistService,
    );

    registerUser = new RegisterUser(userRepository, authService);
    loginUseCase = new LoginUseCase(userRepository, jwtService);

    const { user } = await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      avatarUrl: 'https://github.com/luancamposdev.png',
      password: 'myPassword123',
      role: Role.CUSTOMER,
    });

    registeredUser = user;
  });

  it('Should be able authenticate with valid credentials', async () => {
    const result = await authService.validateCredentials(
      registeredUser.email.value,
      'myPassword123',
    );

    expect(result).toBeDefined();
    expect(result!.email.value).toBe(registeredUser.email.value);
  });

  it('Should throw InvalidCredentialsError with invalid password', async () => {
    const result = loginUseCase.execute({
      email: registeredUser.email.value,
      password: 'wrongPass',
    });

    await expect(result).rejects.toThrow(InvalidCredentialsError);
  });

  it('loginUseCase returns token and user', async () => {
    jest.spyOn(jwtService, 'sign').mockReturnValue('fixed-token');

    const { user: logged, token } = await loginUseCase.execute({
      email: registeredUser.email.value,
      password: 'myPassword123',
    });

    expect(logged).toBeDefined();
    expect(token).toBe('fixed-token');
  });
});
