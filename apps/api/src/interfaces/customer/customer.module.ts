import { Module } from '@nestjs/common';

import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { PrismaCustomerRepository } from '@infrastructure/database/prisma/repositories/prisma-customer.repository';

import { CreateCustomerUseCase } from '@application/customer/use-cases/create-customer.use-case';
import { FindCustomerByUserIdUseCase } from '@application/customer/use-cases/find-customer-by-user-id.use-case';
import { FindCustomerByIdUseCase } from '@application/customer/use-cases/find-customer-by-id.use-case';
import { UpdateCustomerUseCase } from '@application/customer/use-cases/update-customer.use-case';

import { CustomersController } from '@/interfaces/customer/controllers/customers.controller';

@Module({
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    FindCustomerByIdUseCase,
    FindCustomerByUserIdUseCase,
    UpdateCustomerUseCase,

    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
})
export class CustomerModule {}
