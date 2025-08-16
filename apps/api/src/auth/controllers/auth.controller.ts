import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { LocalAuthGuard } from '@/auth/passport/guards/local-auth.guard';
import { JwtAuthGuard } from '@/auth/passport/guards/jwt-auth.guard';
import { RegisterRequestDto } from '@/auth/dto/register-request.dto';
import { UserViewModel } from '@/auth/mappers/user-view.model';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthResponseDto } from '@/auth/dto/auth-reponse.dto';
import { UserEntity } from '@core/users/entities/user.entity';
import { AuthService } from '@/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<AuthResponseDto> {
    try {
      const { user, token } = await this.registerUser.execute({
        name: body.name,
        email: body.email,
        password: body.password,
        avatarUrl: body.avatarUrl,
        role: body.role,
      });

      return { access_token: token, user: UserViewModel.toHTTP(user) };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@CurrentUser() user: UserEntity): AuthResponseDto {
    const token = this.authService.signJwt(user);
    return { access_token: token, user: UserViewModel.toHTTP(user) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: UserEntity) {
    return UserViewModel.toHTTP(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Headers('authorization') authHeader: string) {
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      this.authService.invalidateToken(token);
    }

    return { message: 'Logout realizado com sucesso.' };
  }
}
