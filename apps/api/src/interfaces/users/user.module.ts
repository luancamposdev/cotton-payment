import { Module } from '@nestjs/common';

import { AuthModule } from '@/interfaces/auth/auth.module';
import { UserController } from '@/interfaces/users/controllers/user.controller';
import { UserRepository } from '@core/users/repositories/user.repository';
import { PrismaUserRepository } from '@infrastructure/database/prisma/repositories/prisma-user.repository';
import { CommonModule } from '@infrastructure/common/common.module';
import { UpdateUserUseCase } from '@application/user/use-case/update-user.use-case';
import { DeleteUserUseCase } from '@application/user/use-case/delete-user.use-case';
import { FindUserByEmailUseCase } from '@application/user/use-case/find-user-by-email.use-case';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [UserController],
  providers: [
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserByEmailUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
