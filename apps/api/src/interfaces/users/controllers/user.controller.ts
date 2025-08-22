import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { UserEntity } from '@core/users/entities/user.entity';
import { UpdateUserDto } from '@/interfaces/users/dto/update-user.dto';
import { UserViewModel } from '@/interfaces/auth/mappers/user-view.model';
import { DeleteUserUseCase } from '@application/user/use-case/delete-user.use-case';
import { UpdateUserUseCase } from '@application/user/use-case/update-user.use-case';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Patch()
  async updateProfile(
    @CurrentUser() CurrentUser: UserEntity,
    @Body() body: UpdateUserDto,
  ) {
    const { user } = await this.updateUserUseCase.execute({
      userId: CurrentUser.id,
      ...body,
    });
    return UserViewModel.toHTTP(user);
  }

  @Delete()
  async deleteAccount(
    @CurrentUser() CurrentUser: UserEntity,
    @Req() req: Request,
  ) {
    const authHeader = req.headers.authorization ?? '';
    const accessToken = authHeader.split(' ')[1];
    await this.deleteUserUseCase.execute({
      userId: CurrentUser.id,
      accessToken,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Conta excluída com sucesso.',
    };
  }
}
