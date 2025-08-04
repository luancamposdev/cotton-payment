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
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { LoginUseCase } from '@application/auth/use-case/login.use-case';

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
    RegisterUser,
    LoginUseCase,
    JwtStrategy,
    LocalStrategy,
    { provide: UserRepository, useClass: InMemoryUserRepository },
  ],
  exports: [AuthService],
})
export class AuthModule {}
