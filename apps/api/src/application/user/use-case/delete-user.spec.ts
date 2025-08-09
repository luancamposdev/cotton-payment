import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { AuthService } from '@infrastructure/auth/auth.service';
import { DeleteUser } from '@application/user/use-case/delete-user.use-case';

describe('Delete User', () => {
  let userRepository: InMemoryUserRepository;
  let deleteUser: DeleteUser;
  let registerUser: RegisterUser;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({ secret: 'TEST_SECRET_KEY' });
    authService = new AuthService(userRepository, jwtService);
    registerUser = new RegisterUser(userRepository, authService);
    deleteUser = new DeleteUser(userRepository);
  });

  it('Should be able to soft-delete a user', async () => {
    const { user: registeredUser } = await registerUser.execute({
      name: 'Luan Campos',
      email: 'luancampos@mail.com',
      password: 'myPassword123',
    });

    const { user: deletedUser } = await deleteUser.execute({
      userId: registeredUser.id,
    });

    expect(deletedUser.deleteAccountAt).toBeInstanceOf(Date);
  });

  it('Should throw a NotFoundException if user does not exist', async () => {
    const nonExistentUserId = 'non-existent-id';
    const result = deleteUser.execute({ userId: nonExistentUserId });

    await expect(result).rejects.toThrow(NotFoundException);
  });
});
