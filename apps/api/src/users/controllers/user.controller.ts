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

import { JwtAuthGuard } from '@/auth/passport/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserEntity } from '@core/users/entities/user.entity';
import { UpdateUserDto } from '@/users/dto/UpdateuserDto';
import { UserViewModel } from '@/auth/mappers/user-view.model';
import { UsersService } from '@/users/services/user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() body: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(user, body);
    return UserViewModel.toHTTP(updatedUser);
  }

  @Delete()
  async deleteAccount(@CurrentUser() user: UserEntity, @Req() req: Request) {
    const authHeader = req.headers.authorization ?? '';
    const accessToken = authHeader.split(' ')[1];
    await this.usersService.deleteAccount(user, accessToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Conta excluída com sucesso.',
    };
  }
}
