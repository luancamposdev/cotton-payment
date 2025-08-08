import { ConflictException, Injectable } from '@nestjs/common';

import { Email } from '@core/shared/value-objects/email';
import { UserRepository } from '@core/users/repositories/user.repository';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Password } from '@core/shared/value-objects/password';
import { PasswordHash } from '@core/shared/value-objects/password-hash';
import { Name } from '@core/users/value-objects/name';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';

interface IRegisterUserRequest {
  name: string;
  email: string;
  avatarUrl?: string | null;
  password: string;
}

interface IRegisterUserResponse {
  user: UserEntity;
}

@Injectable()
export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
    avatarUrl,
  }: IRegisterUserRequest): Promise<IRegisterUserResponse> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Usuário já existe.');
    }

    const userEmail = Email.create(email);
    const userName = Name.create(name);
    const userPasswordHash = await PasswordHash.fromPassword(
      Password.create(password),
    );

    const userAvatar = AvatarUrl.create(avatarUrl, userEmail.value);

    const user = new UserEntity({
      name: userName,
      email: userEmail,
      avatarUrl: userAvatar,
      passwordHash: userPasswordHash,
      role: Role.CLIENT,
    });

    await this.userRepository.create(user);

    return { user };
  }
}
