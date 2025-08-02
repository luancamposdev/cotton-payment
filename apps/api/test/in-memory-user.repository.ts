import { UserRepository } from '@core/users/repositories/user.repository';
import { UserEntity } from '@core/users/entities/user.entity';

export class InMemoryUserRepository implements UserRepository {
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
          (l) => l.provider === provider && l.providerId === providerId,
        ),
      ) ?? null
    );
  }
}
