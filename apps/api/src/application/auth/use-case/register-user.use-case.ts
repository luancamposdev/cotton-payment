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
  avatarUrl?: string;
  plainPassword: string;
  role: Role;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: IRegisterUserRequest): Promise<{ user: UserEntity }> {
    const email = Email.create(request.email);

    const existingUser = await this.userRepository.findByEmail(email.value);

    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    const name = Name.create(request.name);
    const avatarUrl = AvatarUrl.create(request.avatarUrl ?? '');

    const role = request.role ?? Role.CLIENT;

    const password = Password.create(request.plainPassword);
    const passwordHash = await PasswordHash.fromPassword(password);

    const user = new UserEntity({
      name,
      email,
      avatarUrl,
      password,
      passwordHash,
      role: role,
    });

    await this.userRepository.create(user);

    return { user };
  }
}
