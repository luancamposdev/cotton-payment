import { Injectable } from '@nestjs/common';

import { UserEntity } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';

interface FindUserByEmailRequest {
  email: string;
}

interface FindUserByEmailResponse {
  user: UserEntity;
}

@Injectable()
export class FindUserByEmail {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(
    request: FindUserByEmailRequest,
  ): Promise<FindUserByEmailResponse> {
    const { email } = request;

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error('Usuário não encontrado');

    return { user };
  }
}
