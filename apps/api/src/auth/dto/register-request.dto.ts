import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { Password } from '@core/shared/value-objects/password';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Role } from '@core/users/entities/user.entity';

export class RegisterRequestDto {
  name: Name;
  email: Email;
  password: Password;
  avatarUrl?: AvatarUrl;
  role: Role.CLIENT;
}
