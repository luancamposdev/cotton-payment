import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressRepository } from '@core/addresses/repository/address.repository';
import { AddressEntity } from '@core/addresses/entities/address.entity';

@Injectable()
export class FindAddressByIdUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(id: string): Promise<{ address: AddressEntity }> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return { address };
  }
}
