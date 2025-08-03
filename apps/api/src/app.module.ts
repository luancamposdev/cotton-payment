import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), CustomersModule],
})
export class AppModule {}
