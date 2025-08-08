import { UserRepository } from '@core/users/repositories/user.repository';
import { UserEntity } from '@core/users/entities/user.entity';

export class InMemoryUserRepository implements UserRepository {
  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.id === id);
    return user ?? null;
  }
  public users: UserEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(user: UserEntity): Promise<void> {
    this.users.push(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.email.value === email);
    return user ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findBySocialLogin(
    provider: string,
    providerId: string,
  ): Promise<UserEntity | null> {
    return (
      this.users.find((user) =>
        user.socialLogins.some(
          (login) =>
            login.provider === provider && login.providerId === providerId,
        ),
      ) ?? null
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(user: UserEntity): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);

    if (index >= 0) this.users[index] = user;
  }
}
