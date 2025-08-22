import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { UpdateUserUseCase } from '@application/user/use-case/update-user.use-case';
import { RegisterUser } from '@application/auth/use-cases/register-user.use-case';
import { AuthService } from '@infrastructure/auth/services/auth.service';
import { Role } from '@core/users/entities/user.entity';
import { TokenBlacklistService } from '@infrastructure/auth/services/token-blacklist.service';

describe('Update user', () => {
  const userRepository = new InMemoryUserRepository();
  const jwtService = new JwtService({ secret: 'TEST_SECRET_KEY' });
  const tokenBlacklistService = new TokenBlacklistService();
  const authService = new AuthService(
    userRepository,
    jwtService,
    tokenBlacklistService,
  );
  const registerUser = new RegisterUser(userRepository, authService);
  const updateUser = new UpdateUserUseCase(userRepository);

  it('Should be able to update a user', async () => {
    const { user: registeredUser } = await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      avatarUrl: 'https://gitub.com/luancamposdev.png',
      password: 'myPassword123',
      role: Role.CUSTOMER,
    });

    const { user } = await updateUser.execute({
      userId: registeredUser.id,
      name: 'Luan Campos Reis',
      avatarUrl: 'https://gitub.com/luancamposdev.png',
      role: Role.CREATOR,
    });

    expect(user.name.value).toBe('Luan Campos Reis');
    expect(user.avatarUrl?.value).toBe('https://gitub.com/luancamposdev.png');
    expect(user.role).toBe(Role.CREATOR);
  });

  it('Should throw a NotFoundException if user does not exist', async () => {
    const nonExistentUserId = 'non-existent-id';
    const result = updateUser.execute({
      userId: nonExistentUserId,
      name: 'Luan Campos',
    });

    await expect(result).rejects.toThrow(NotFoundException);
  });
});
