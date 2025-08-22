import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/interfaces/auth/auth.module';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UserModule } from '@/interfaces/users/user.module';
import { CreatorsModule } from '@/interfaces/creators/creators.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, CreatorsModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
