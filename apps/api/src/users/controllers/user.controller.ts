import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/passport/guards/jwt-auth.guard';
import { UpdateUser } from '@application/user/use-case/update-user.use-case';
import { DeleteUser } from '@application/user/use-case/delete-user.use-case';
import { CurrentUser } from '@/auth/current-user.decorator';
import { UserEntity } from '@core/users/entities/user.entity';
import { UpdateUserDto } from '@/users/dto/UpdateuserDto';
import { UserViewModel } from '@infrastructure/auth/mappers/user-view.model';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser,
  ) {}

  @Patch()
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() body: UpdateUserDto,
  ) {
    const { user: updatedUser } = await this.updateUser.execute({
      userId: user.id,
      name: body.name,
      avatarUrl: body.avatarUrl,
      role: body.role,
    });

    return UserViewModel.toHTTP(updatedUser);
  }

  @Delete()
  async deleteAccount(@CurrentUser() user: UserEntity) {
    await this.deleteUser.execute({
      userId: user.id,
    });
  }
}
