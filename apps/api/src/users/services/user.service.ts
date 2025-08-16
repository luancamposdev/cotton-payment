import { Injectable } from '@nestjs/common';
import { UpdateUser } from '@application/user/use-case/update-user.use-case';
import { DeleteUser } from '@application/user/use-case/delete-user.use-case';
import { UserEntity } from '@core/users/entities/user.entity';
import { UpdateUserDto } from '@/users/dto/UpdateuserDto';

@Injectable()
export class UsersService {
  constructor(
    private readonly updateUserUseCase: UpdateUser,
    private readonly deleteUserUseCase: DeleteUser,
  ) {}

  async updateProfile(
    user: UserEntity,
    data: UpdateUserDto,
  ): Promise<UserEntity> {
    const { user: updatedUser } = await this.updateUserUseCase.execute({
      userId: user.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
      role: data.role,
    });

    return updatedUser;
  }

  async deleteAccount(user: UserEntity, accessToken: string): Promise<void> {
    await this.deleteUserUseCase.execute({
      userId: user.id,
      accessToken,
    });
  }
}
