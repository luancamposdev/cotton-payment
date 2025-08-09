import { Injectable, NotFoundException } from '@nestjs/common';

import { UserEntity } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';
import { Name } from '@core/users/value-objects/name';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Role } from '@core/users/entities/user.entity';

interface IUpdateUserRequest {
  userId: string;
  name?: string;
  avatarUrl?: string | null;
  role?: Role;
}

interface IUpdateUserResponse {
  user: UserEntity;
}

@Injectable()
export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    userId,
    name,
    avatarUrl,
    role,
  }: IUpdateUserRequest): Promise<IUpdateUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (name) {
      user.name = Name.create(name);
    }

    if (avatarUrl) {
      user.avatarUrl = AvatarUrl.create(avatarUrl);
    }

    if (role) {
      user.role = role;
    }

    await this.userRepository.save(user);

    return { user };
  }
}
