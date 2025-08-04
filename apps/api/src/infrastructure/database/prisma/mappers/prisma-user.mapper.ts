import {
  Users as RawUsers,
  SocialLogin as RawSocialLogin,
} from '@prisma/client';

import {
  ISocialLogin,
  Role,
  UserEntity,
} from '@core/users/entities/user.entity';
import { PasswordHash } from '@core/shared/value-objects/password-hash';
import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';

type RawUserWithSocial = RawUsers & {
  socialLogins?: RawSocialLogin[];
};

export class PrismaUserMapper {
  static toPrisma(user: UserEntity) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      avatarUrl: user.avatarUrl.value,
      passwordHash: user.passwordHash.value(),
      role: user.role,
      deletedAccountAt: user.deleteAccountAt,
      createdAt: user.createdAt,
    };
  }

  static toDomain(raw: RawUserWithSocial): UserEntity {
    const user = new UserEntity(
      {
        name: Name.create(raw.name),
        email: Email.create(raw.email),
        avatarUrl: AvatarUrl.create(raw.avatarUrl),
        passwordHash: PasswordHash.fromHash(raw.passwordHash),
        role: raw.role as Role,
        deletedAccountAt: raw.deletedAccountAt,
        createdAt: raw.createdAt,
        socialLogins: [],
      },
      raw.id,
    );

    if (raw.socialLogins && raw.socialLogins.length) {
      raw.socialLogins.forEach((sl) => {
        user.addSocialLogin({
          provider: sl.provider as ISocialLogin['provider'],
          providerId: sl.providerId,
        });
      });

      return user;
    }

    return user;
  }
}
