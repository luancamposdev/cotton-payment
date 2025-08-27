import { Injectable, NotFoundException } from '@nestjs/common';

import { AddressRepository } from '@core/addresses/repository/address.repository';
import { UpdateAddressDto } from '@/interfaces/addresses/dto/update-address.dto';
import { AddressEntity } from '@core/addresses/entities/address.entity';

@Injectable()
export class UpdateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(
    dto: UpdateAddressDto,
    id: string,
  ): Promise<{ address: AddressEntity }> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException('Address does not exist');
    }

    Object.assign(address, dto);

    await this.addressRepository.save(address);

    return { address };
  }
}
