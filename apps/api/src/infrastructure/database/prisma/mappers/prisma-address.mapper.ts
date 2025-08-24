import { Injectable } from '@nestjs/common';

import { Address as RawAddress } from '@prisma/client';
import {
  AddressEntity,
  AddressType,
} from '@core/addresses/entities/address.entity';

@Injectable()
export class PrismaAddressMapper {
  static toPrisma(address: AddressEntity) {
    return {
      id: address.id,
      userId: address.userId,
      type: address.type,
      street: address.street,
      number: address.number ?? null,
      complement: address.complement ?? null,
      district: address.district ?? null,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country ?? 'BR',
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  static toDomain(raw: RawAddress): AddressEntity {
    const type = Object.values(AddressType).includes(raw.type as AddressType)
      ? (raw.type as AddressType)
      : AddressType.RESIDENTIAL;
    return new AddressEntity(
      {
        userId: raw.userId,
        type,
        street: raw.street,
        number: raw.number ?? undefined,
        complement: raw.complement ?? null,
        district: raw.district ?? null,
        city: raw.city,
        state: raw.state,
        postalCode: raw.postalCode,
        country: raw.country ?? 'BR',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
