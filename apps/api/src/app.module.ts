import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

@Global()
@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), AuthModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
