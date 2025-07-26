import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, UsersModule, ConfigModule.forRoot()],
})
export class AppModule {}
