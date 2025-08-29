import { AddressRepository } from '@core/addresses/repository/address.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(id: string): Promise<void> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new Error(`Address with id ${id} not found`);
    }

    await this.addressRepository.delete(id);
  }
}
