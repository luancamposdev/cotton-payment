import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UserController } from '@/users/controllers/user.controller';
import { DeleteUser } from '@application/user/use-case/delete-user.use-case';
import { UserRepository } from '@core/users/repositories/user.repository';
import { PrismaUserRepository } from '@infrastructure/database/prisma/repositories/prisma-user.repository';
import { UpdateUser } from '@application/user/use-case/update-user.use-case';
import { CommonModule } from '@/common/common.module';
import { UsersService } from '@/users/services/user.service';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [UserController],
  providers: [
    UsersService,
    UpdateUser,
    DeleteUser,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
