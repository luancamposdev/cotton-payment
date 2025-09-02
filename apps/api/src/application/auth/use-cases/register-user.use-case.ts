import { Injectable } from '@nestjs/common';

import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrlVo } from '@core/users/value-objects/avatar-url.vo';
import { Password } from '@core/users/value-objects/password';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';
import { PasswordHash } from '@core/users/value-objects/password-hash';
import { AuthService } from '@infrastructure/auth/services/auth.service';
import { RegisterRequestDto } from '@/interfaces/auth/dto/register-request.dto';

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
  }: RegisterRequestDto): Promise<RegisterUserResponse> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('Usuário já esta cadastrado.');
    }

    const userName = Name.create(name);
    const userEmail = Email.create(email);
    const userPasswordHash = await PasswordHash.fromPassword(
      Password.create(password),
    );
    const userAvatarUrl = AvatarUrlVo.create(avatarUrl);

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
