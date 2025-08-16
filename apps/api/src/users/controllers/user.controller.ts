import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '@infrastructure/auth/passport/guards/jwt-auth.guard';
import { UpdateUser } from '@application/user/use-case/update-user.use-case';
import { DeleteUser } from '@application/user/use-case/delete-user.use-case';
import { CurrentUser } from '@/auth/current-user.decorator';
import { UserEntity } from '@core/users/entities/user.entity';
import { UpdateUserDto } from '@application/user/dto/UpdateuserDto';
import { UserViewModel } from '@infrastructure/auth/mappers/user-view.model';

@Controller('users')
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
      email: body.email,
      avatarUrl: body.avatarUrl,
      role: body.role,
    });

    return UserViewModel.toHTTP(updatedUser);
  }

  @Delete()
  async deleteAccount(@CurrentUser() user: UserEntity, @Req() req: Request) {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação inválido.');
    }
    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    await this.deleteUser.execute({
      userId: user.id,
      accessToken,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Conta excluída com sucesso.',
    };
  }
}
