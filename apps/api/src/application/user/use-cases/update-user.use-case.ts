import { Injectable, NotFoundException } from '@nestjs/common';

import { UserEntity } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';
import { Name } from '@core/users/value-objects/name';
import { AvatarUrlVo } from '@core/users/value-objects/avatar-url.vo';
import { Role } from '@core/users/entities/user.entity';
import { Email } from '@core/shared/value-objects/email';

interface IUpdateUserRequest {
  userId: string;
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  role?: Role;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    userId,
    name,
    email,
    avatarUrl,
    role,
  }: IUpdateUserRequest): Promise<{ user: UserEntity }> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (name) {
      user.name = Name.create(name);
    }

    if (email) {
      user.email = Email.create(email);
    }

    if (avatarUrl) {
      user.avatarUrl = AvatarUrlVo.create(avatarUrl);
    }

    if (role) {
      user.role = role;
    }

    await this.userRepository.save(user);

    return { user };
  }
}
