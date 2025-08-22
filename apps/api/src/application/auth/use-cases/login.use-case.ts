import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@core/users/repositories/user.repository';
import { UserEntity } from '@core/users/entities/user.entity';
import { Password } from '@core/users/value-objects/password';
import { InvalidCredentialsError } from '@application/auth/use-cases/errors/invalid-credentials.error';

interface ILoginUserRequest {
  email: string;
  password: string;
}

interface ILoginUserResponse {
  user: UserEntity;
  token: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    email,
    password,
  }: ILoginUserRequest): Promise<ILoginUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await user.passwordHash.compare(Password.create(password));

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email.value,
      role: user.role,
    });

    return { user, token };
  }
}
