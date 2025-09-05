import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { RegisterUser } from '@application/auth/use-cases/register-user.use-case';
import { AuthService } from '@infrastructure/auth/services/auth.service';
import { DeleteUserUseCase } from '@application/user/use-cases/delete-user.use-case';
import { TokenBlacklistService } from '@infrastructure/auth/services/token-blacklist.service';
import { Role } from '@core/users/entities/user.entity';

describe('Delete User', () => {
  let userRepository: InMemoryUserRepository;
  let deleteUser: DeleteUserUseCase;
  let registerUser: RegisterUser;
  let authService: AuthService;
  let jwtService: JwtService;
  let tokenBlacklistService: TokenBlacklistService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({ secret: 'TEST_SECRET_KEY' });
    tokenBlacklistService = new TokenBlacklistService();
    // Pass userRepository and authService to DeleteUser constructor
    authService = new AuthService(
      userRepository,
      jwtService,
      tokenBlacklistService,
    );
    registerUser = new RegisterUser(userRepository, authService);
    deleteUser = new DeleteUserUseCase(userRepository, authService); // Pass authService here
  });

  it('Should be able to soft-delete a user', async () => {
    const { user: registeredUser } = await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      password: 'myPassword123',
      role: Role.CUSTOMER,
    });

    const dummyAccessToken = jwtService.sign(
      { userId: registeredUser.id, role: registeredUser.role },
      { expiresIn: '1h' },
    );

    await deleteUser.execute({
      userId: registeredUser.id,
      accessToken: dummyAccessToken, // Provide the access token
    });

    const softDeletedUser = await userRepository.findById(registeredUser.id);

    expect(softDeletedUser?.deleteAccountAt).toBeInstanceOf(Date);
  });

  it('Should throw a NotFoundException if user does not exist', async () => {
    const nonExistentUserId = 'non-existent-id';
    // Generate a dummy access token, it doesn't matter for this specific test's outcome
    const dummyAccessToken = jwtService.sign(
      { userId: 'some-user-id', role: Role.CUSTOMER },
      { expiresIn: '1h' },
    );

    await expect(() =>
      deleteUser.execute({
        userId: nonExistentUserId,
        accessToken: dummyAccessToken, // Provide the access token
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
