import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Role } from '@core/users/entities/user.entity';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    name: Name;
    email: Email;
    avatarUrl?: AvatarUrl;
    role: Role;
    createdAt: Date;
  };
}
