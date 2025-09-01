import { Injectable } from '@nestjs/common';

import { CustomerEntity } from '@core/customer/entities/customer.entity';

type RawCustomer = {
  id: string;
  userId: string;
  defaultAddressId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaCustomerMapper {
  static toPrisma(entity: CustomerEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      defaultAddressId: entity.defaultAddressId,
    };
  }

  static toDomain(raw: RawCustomer): CustomerEntity {
    return new CustomerEntity(
      {
        userId: raw.userId,
        defaultAddressId: raw.defaultAddressId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
