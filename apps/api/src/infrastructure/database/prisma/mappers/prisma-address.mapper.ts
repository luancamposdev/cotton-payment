import {
  AddressEntity,
  AddressType as EntityAddressType,
} from '@core/addresses/entities/address.entity';
import { AddressType as PrismaAddressType } from '@prisma/client';

export type RawAddress = {
  id: string;
  userId: string;
  type: PrismaAddressType;
  street: string;
  number?: string | null;
  complement?: string | null;
  district?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaAddressMapper {
  static toPrisma(address: AddressEntity): RawAddress {
    return {
      id: address.id,
      userId: address.userId,
      type: address.type as unknown as PrismaAddressType,
      street: address.street,
      number: address.number ?? null,
      complement: address.complement ?? null,
      district: address.district ?? null,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode.getValue,
      country: address.country.getValue,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  static toDomain(raw: RawAddress): AddressEntity {
    const typeMap: Record<PrismaAddressType, EntityAddressType> = {
      RESIDENTIAL: EntityAddressType.RESIDENTIAL,
      COMMERCIAL: EntityAddressType.COMMERCIAL,
      SHIPPING: EntityAddressType.SHIPPING,
      BILLING: EntityAddressType.BILLING,
    };

    return new AddressEntity(
      {
        userId: raw.userId,
        type: typeMap[raw.type],
        street: raw.street,
        number: raw.number ?? null,
        complement: raw.complement ?? null,
        district: raw.district ?? null,
        city: raw.city,
        state: raw.state,
        postalCode: raw.postalCode,
        country: raw.country,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
