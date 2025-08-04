import { ConflictException, Injectable } from '@nestjs/common';

import { Email } from '@core/shared/value-objects/email';
import { UserRepository } from '@core/users/repositories/user.repository';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Password } from '@core/shared/value-objects/password';
import { PasswordHash } from '@core/shared/value-objects/password-hash';
import { Name } from '@core/users/value-objects/name';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';

interface IRegisterUserRequest {
  name: Name;
  email: Email;
  avatarUrl?: AvatarUrl;
  password: Password;
  role: Role;
}

interface IRegisterUserResponse {
  user: UserEntity;
}

@Injectable()
export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: IRegisterUserRequest): Promise<IRegisterUserResponse> {
    const email = request.email; // já é value object
    const existingUser = await this.userRepository.findByEmail(email.value);

    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    const name = request.name;
    const avatarUrl = request.avatarUrl ?? AvatarUrl.create('');
    const role = request.role ?? Role.CLIENT;
    const password = request.password;
    const passwordHash = await PasswordHash.fromPassword(password);

    const user = new UserEntity({
      name,
      email,
      avatarUrl,
      passwordHash,
      role,
    });

    await this.userRepository.create(user);

    return { user };
  }
}
