import { Module } from '@nestjs/common';

import { AddressController } from '@/interfaces/addresses/controllers/address.controller';
import { CreateAddressUseCase } from '@application/address/create-address.use-case';
import { AddressRepository } from '@core/addresses/repository/address.repository';
import { PrismaAddressRepository } from '@infrastructure/database/prisma/repositories/prisma-address.repository';
import { FindAddressByIdUseCase } from '@application/address/find-address-by-id.use-case';
import { FindAddressesByUserIdUseCase } from '@application/address/find-addresses-by-user-id.use-case';

@Module({
  controllers: [AddressController],
  providers: [
    CreateAddressUseCase,
    FindAddressByIdUseCase,
    FindAddressesByUserIdUseCase,
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
  ],
})
export class AddressModule {}
