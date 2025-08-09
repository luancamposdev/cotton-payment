import { Module } from '@nestjs/common';

import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository';
import { UserRepository } from '@core/users/repositories/user.repository';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class DatabaseModule {}
