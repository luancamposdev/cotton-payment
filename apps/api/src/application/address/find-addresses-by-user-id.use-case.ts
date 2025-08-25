import { Injectable } from '@nestjs/common';

import { AddressRepository } from '@core/addresses/repository/address.repository';
import { AddressEntity } from '@core/addresses/entities/address.entity';

interface FindAddressByUserIdRequest {
  id: string;
}

@Injectable()
export class FindAddressesByUserIdUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    id,
  }: FindAddressByUserIdRequest): Promise<{ addresses: AddressEntity[] }> {
    const addresses = await this.addressRepository.findManyByUserId(id);

    return { addresses };
  }
}
