import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '@core/users/repositories/user.repository';
import { AuthService } from '@infrastructure/auth/services/auth.service';

interface IDeleteUserRequest {
  userId: string;
  accessToken: string;
}

type IDeleteUserResponse = void;

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute({
    userId,
    accessToken,
  }: IDeleteUserRequest): Promise<IDeleteUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (user.deleteAccountAt) {
      throw new UnauthorizedException('Sua conta foi cancelada.');
    }

    user.deleteAccount();

    await this.userRepository.save(user);

    this.authService.invalidateToken(accessToken);
  }
}
