import { Module } from '@nestjs/common';

import { AddressRepository } from '@core/addresses/repository/address.repository';
import { PrismaAddressRepository } from '@infrastructure/database/prisma/repositories/prisma-address.repository';

import { CreateAddressUseCase } from '@application/address/use-cases/create-address.use-case';
import { FindAddressByIdUseCase } from '@application/address/use-cases/find-address-by-id.use-case';
import { FindAddressesByUserIdUseCase } from '@application/address/use-cases/find-addresses-by-user-id.use-case';
import { UpdateAddressUseCase } from '@application/address/use-cases/update-address.use-case';
import { DeleteAddressUseCase } from '@application/address/use-cases/delete-address.use-case';

import { AddressController } from '@/interfaces/addresses/controllers/address.controller';

@Module({
  controllers: [AddressController],
  providers: [
    CreateAddressUseCase,
    FindAddressByIdUseCase,
    FindAddressesByUserIdUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
  ],
})
export class AddressModule {}
