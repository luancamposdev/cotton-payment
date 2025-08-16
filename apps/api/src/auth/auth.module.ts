import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@/auth/jwt/jwt-config.service';
import { AuthController } from '@/auth/controllers/auth.controller';
import { AuthService } from '@/auth/services/auth.service';
import { JwtStrategy } from '@/auth/passport/strategies/jwt.strategy';
import { LocalStrategy } from '@/auth/passport/strategies/local.strategy';
import { UserRepository } from '@core/users/repositories/user.repository';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { LoginUseCase } from '@application/auth/use-case/login.use-case';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { ConfigModule } from '@nestjs/config';
import { TokenBlacklistService } from '@/auth/services/token-blacklist.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [
    TokenBlacklistService,
    AuthService,
    RegisterUser,
    LoginUseCase,
    JwtStrategy,
    LocalStrategy,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [AuthService],
})
export class AuthModule {}
