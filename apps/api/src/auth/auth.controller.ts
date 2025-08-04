import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { LocalAuthGuard } from '@/infrastructure/auth/passport/guards/local-auth.guard';
import { JwtAuthGuard } from '@/infrastructure/auth/passport/guards/jwt-auth.guard';
import { AuthResponseDto } from '@/auth/dto/auth-reponse.dto';
import { RegisterRequestDto } from '@/auth/dto/register-request.dto';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { UserViewModel } from '@/auth/mapper/user-view.model';

import { UserEntity } from '@core/users/entities/user.entity';
import { Name } from '@core/users/value-objects/name';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Email } from '@core/shared/value-objects/email';
import { Password } from '@core/shared/value-objects/password';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registerUser: RegisterUser,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<AuthResponseDto> {
    const { user } = await this.registerUser.execute({
      name: Name.create(body.name),
      email: Email.create(body.email),
      avatarUrl: AvatarUrl.create(body.avatarUrl ?? ''),
      password: Password.create(body.password),
      role: body.role,
    });
    const token = this.authService.signJwt(user);
    return { access_token: token, user: UserViewModel.toHTTP(user) };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: { user: UserEntity }): AuthResponseDto {
    const token = this.authService.signJwt(req.user);
    return { access_token: token, user: UserViewModel.toHTTP(req.user) };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  profile(@Req() req: { user: UserEntity }) {
    return UserViewModel.toHTTP(req.user);
  }
}
