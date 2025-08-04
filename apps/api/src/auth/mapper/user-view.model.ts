import { UserEntity } from '@core/users/entities/user.entity';

export class UserViewModel {
  static toHTTP(user: UserEntity) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      avatarUrl: user.avatarUrl?.value ?? null,
      role: user.role,
      createdAt: user.createdAt,
      deletedAccountAt: user.deleteAccountAt ?? null,
      socialLogins: user.socialLogins.map((sl) => ({
        provider: sl.provider,
        providerId: sl.providerId,
      })),
    };
  }
}
