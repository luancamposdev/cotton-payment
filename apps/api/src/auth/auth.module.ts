import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@/infrastructure/auth/jwt/jwt-config.service';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/infrastructure/auth/passport/strategies/jwt.strategy';
import { LocalStrategy } from '@/infrastructure/auth/passport/strategies/local.strategy';
import { UserRepository } from '@core/users/repositories/user.repository';
import { InMemoryUserRepository } from '@test/in-memory-user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    { provide: UserRepository, useClass: InMemoryUserRepository },
  ],
})
export class AuthModule {}
