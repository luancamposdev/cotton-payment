import { Role } from '@core/users/entities/user.entity';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: Role;
    createdAt: Date;
  };
}
