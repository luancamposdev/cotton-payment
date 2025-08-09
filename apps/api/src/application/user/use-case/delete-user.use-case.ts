import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';

interface IDeleteUserRequest {
  userId: string;
}

interface IDeleteUserResponse {
  user: UserEntity;
}

@Injectable()
export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: IDeleteUserRequest): Promise<IDeleteUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    user.deleteAccount();

    await this.userRepository.save(user);

    return { user };
  }
}
