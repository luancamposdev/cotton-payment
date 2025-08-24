import { Module } from '@nestjs/common';

import { AddressController } from '@/interfaces/addresses/controllers/address.controller';
import { CreateAddressUseCase } from '@application/address/create-address.use-case';
import { AddressRepository } from '@core/addresses/repository/address.repository';
import { PrismaAddressRepository } from '@infrastructure/database/prisma/repositories/prisma-address.repository';

@Module({
  controllers: [AddressController],
  providers: [
    CreateAddressUseCase,
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
  ],
})
export class AddressModule {}
