import { Injectable, NotFoundException } from '@nestjs/common';

import { AddressRepository } from '@core/addresses/repository/address.repository';

@Injectable()
export class DeleteAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(id: string): Promise<{ statusCode: number; message: string }> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException(`Endereço com id ${id} não encontrado.`);
    }

    await this.addressRepository.delete(id);

    return {
      statusCode: 200,
      message: 'Endereço excluído com sucesso.',
    };
  }
}
