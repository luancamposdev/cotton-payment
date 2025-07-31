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
    const email = Email.create(request.email.value);
    const existingUser = await this.userRepository.findByEmail(email.value);

    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    const name = Name.create(request.name.value);
    const avatarUrl = AvatarUrl.create(request.avatarUrl?.value ?? '');
    const role = request.role ?? Role.CLIENT;
    const password = Password.create(request.password.value());

    const user = new UserEntity({
      name,
      email,
      avatarUrl,
      passwordHash: await PasswordHash.fromPassword(password),
      role,
    });

    await this.userRepository.create(user);

    return { user };
  }
}
