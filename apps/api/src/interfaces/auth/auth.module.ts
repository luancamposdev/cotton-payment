import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { JwtConfigService } from '@infrastructure/auth/jwt/jwt-config.service';
import { AuthService } from '@infrastructure/auth/services/auth.service';
import { TokenBlacklistService } from '@infrastructure/auth/services/token-blacklist.service';

import { JwtStrategy } from '@infrastructure/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@infrastructure/auth/strategies/local.strategy';

import { RegisterUser } from '@application/auth/use-cases/register-user.use-case';
import { LoginUseCase } from '@application/auth/use-cases/login.use-case';

import { UserRepository } from '@core/users/repositories/user.repository';
import { PrismaUserRepository } from '@infrastructure/database/prisma/repositories/prisma-user.repository';

import { AuthController } from '@/interfaces/auth/controllers/auth.controller';

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
