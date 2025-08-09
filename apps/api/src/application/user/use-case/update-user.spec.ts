import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { UpdateUser } from '@application/user/use-case/update-user.use-case';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { AuthService } from '@infrastructure/auth/auth.service';
import { Role } from '@core/users/entities/user.entity';

describe('Update user', () => {
  let userRepository: InMemoryUserRepository;
  let updateUser: UpdateUser;
  let registerUser: RegisterUser;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({ secret: 'TEST_SECRET_KEY' });
    authService = new AuthService(userRepository, jwtService);
    registerUser = new RegisterUser(userRepository, authService);
    updateUser = new UpdateUser(userRepository);
  });

  it('Should be able to update a user', async () => {
    const { user: registeredUser } = await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      avatarUrl: 'https://gitub.com/luancamposdev.png',
      password: 'myPassword123',
    });

    const { user: updatedUser } = await updateUser.execute({
      userId: registeredUser.id,
      name: 'Luan Campos Reis',
      avatarUrl: 'https://gitub.com/luancamposdev.png',
      role: Role.CREATOR,
    });

    expect(updatedUser.name.value).toBe('Luan Campos Reis');
    expect(updatedUser.avatarUrl?.value).toBe(
      'https://gitub.com/luancamposdev.png',
    );
    expect(updatedUser.role).toBe(Role.CREATOR);
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
