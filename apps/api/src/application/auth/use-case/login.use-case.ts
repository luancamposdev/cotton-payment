import { Email } from '@core/shared/value-objects/email';
import { UserEntity } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { Password } from '@core/shared/value-objects/password';

interface ILoginUserRequest {
  email: Email;
  password: Password;
}

interface ILoginUserResponse {
  user: UserEntity;
}

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: ILoginUserRequest): Promise<ILoginUserResponse> {
    const email = Email.create(request.email.value);
    const user = await this.userRepository.findByEmail(email.value);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const isValid = await user.passwordHash.compare(request.password);

    if (!isValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return { user };
  }
}
