import { Injectable } from '@nestjs/common';

import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Password } from '@core/shared/value-objects/password';
import { UserEntity, Role } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';
import { PasswordHash } from '@core/shared/value-objects/password-hash';
import { AuthService } from '@/auth/services/auth.service';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  role: Role;
}

interface RegisterUserResponse {
  user: UserEntity;
  token: string;
}

@Injectable()
export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute({
    name,
    email,
    password,
    avatarUrl,
    role,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists.');
    }

    const userName = Name.create(name);
    const userEmail = Email.create(email);
    const userPasswordHash = await PasswordHash.fromPassword(
      Password.create(password),
    );
    const userAvatarUrl = AvatarUrl.create(avatarUrl);

    const user = new UserEntity({
      name: userName,
      email: userEmail,
      avatarUrl: userAvatarUrl,
      passwordHash: userPasswordHash,
      role: role ?? Role.CUSTOMER,
    });

    await this.userRepository.create(user);
    const token = this.authService.signJwt(user);

    return { user, token };
  }
}
