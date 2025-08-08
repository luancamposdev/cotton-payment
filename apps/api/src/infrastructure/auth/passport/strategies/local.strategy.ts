import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LocalPassportStrategy } from 'passport-local';

import { LOCAL_STRATEGY } from '@/infrastructure/auth/constants';
import { AuthService } from '@/infrastructure/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  LocalPassportStrategy,
  LOCAL_STRATEGY,
) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    return user;
  }
}
