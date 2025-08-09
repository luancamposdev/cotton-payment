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

export class UserViewModel {
  static toHTTP(user: UserEntity) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      avatarUrl: user.avatarUrl?.value,
      role: user.role,
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
    }

    return user;
  }
}
