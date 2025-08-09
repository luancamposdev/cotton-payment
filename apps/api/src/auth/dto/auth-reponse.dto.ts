import { Role } from '@core/users/entities/user.entity';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    role: Role;
    createdAt: Date;
  };
}
