import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LocalAuthGuard } from '@/infrastructure/auth/passport/guards/local-auth.guard';
import { AuthResponseDto } from '@/auth/dto/auth-reponse.dto';
import { UserEntity } from '@core/users/entities/user.entity';
import { JwtAuthGuard } from '@/infrastructure/auth/passport/guards/jwt-auth.guard';
import { RegisterRequestDto } from '@/auth/dto/register-request.dto';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registerUser: RegisterUser,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<AuthResponseDto> {
    const { user } = await this.registerUser.execute(body);
    const token = this.authService.signJwt(user);
    return { access_token: token, user };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: { user: UserEntity }): AuthResponseDto {
    const token = this.authService.signJwt(req.user);
    return { access_token: token, user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  profile(@Req() req: { user: UserEntity }) {
    return req.user;
  }
}
