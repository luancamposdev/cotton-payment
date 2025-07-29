import { FindUserByEmail } from './find-user-by-email.use-case';
import { InMemoryUserRepository } from '@test/in-memory-user.repository';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Password } from '@core/shared/value-objects/password';
import { PasswordHash } from '@core/shared/value-objects/password-hash';

describe('FindUserByEmailUseCase', () => {
  it('Should return an user', async () => {
    const userRepository = new InMemoryUserRepository();
    const findUserByEmail = new FindUserByEmail(userRepository);

    const password = Password.create('myPassword123');
    const passwordHash = await PasswordHash.fromPassword(password);

    const user = new UserEntity({
      name: Name.create('Luan Campos'),
      email: Email.create('luancampos@mail.com'),
      avatarUrl: AvatarUrl.create('https://github.com/luancamposdev.png'),
      password,
      passwordHash,
      role: Role.CREATOR,
    });

    await userRepository.create(user);

    const result = await findUserByEmail.execute({
      email: 'luancampos@mail.com',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email.value).toBe('luancampos@mail.com');
    expect(result.user.name.value).toBe('Luan Campos');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const userRepository = new InMemoryUserRepository();
    const findUserByEmail = new FindUserByEmail(userRepository);

    await expect(
      findUserByEmail.execute({ email: 'notfound@example.com' }),
    ).rejects.toThrow('Usuário não encontrado');
  });
});
