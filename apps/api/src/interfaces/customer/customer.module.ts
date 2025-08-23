import { Module } from '@nestjs/common';

import { CustomersController } from '@/interfaces/customer/controllers/customers.controller';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { UpdateCustomerUseCase } from '@application/customer/use-case/update-customer.use-case';
import { FindCustomerByUserIdUseCase } from '@application/customer/use-case/find-customer-by-user-id.use-case';
import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { PrismaCustomerRepository } from '@infrastructure/database/prisma/repositories/prisma-customer.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    FindCustomerByUserIdUseCase,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
})
export class CustomerModule {}
