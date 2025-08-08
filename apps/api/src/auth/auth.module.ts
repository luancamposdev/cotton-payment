import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@/infrastructure/auth/jwt/jwt-config.service';
import { AuthController } from '@/infrastructure/auth/controllers/auth.controller';
import { AuthService } from '@/infrastructure/auth/auth.service';
import { JwtStrategy } from '@/infrastructure/auth/passport/strategies/jwt.strategy';
import { LocalStrategy } from '@/infrastructure/auth/passport/strategies/local.strategy';
import { UserRepository } from '@core/users/repositories/user.repository';
import { RegisterUser } from '@application/auth/use-case/register-user.use-case';
import { LoginUseCase } from '@application/auth/use-case/login.use-case';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { ConfigModule } from '@nestjs/config';

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
