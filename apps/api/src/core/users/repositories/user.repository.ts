import { UserEntity } from '@core/users/entities/user.entity';

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<void>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
