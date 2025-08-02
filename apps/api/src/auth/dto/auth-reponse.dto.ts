export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    createdAt: Date;
  };
}
