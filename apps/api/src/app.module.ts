import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UserModule } from '@/users/user.module';
import { CreatorsModule } from '@/creators/creators.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, CreatorsModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
