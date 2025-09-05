import { InMemoryAddressRepository } from '@test/in-memory-address.repository';
import { FindAddressByIdUseCase } from '@application/address/use-cases/find-address-by-id.use-case';
import {
  AddressEntity,
  AddressType,
} from '@core/addresses/entities/address.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindAddressByIdUseCase', () => {
  it('should return an address by id', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const useCase = new FindAddressByIdUseCase(addressRepository);

    const address = new AddressEntity({
      userId: 'user-1',
      type: AddressType.RESIDENTIAL,
      street: 'Street A',
      district: 'District A',
      city: 'City A',
      state: 'ST',
      postalCode: '12345678',
      country: 'BR',
    });

    addressRepository.addresses = [address];

    const result = await useCase.execute(address.id);

    expect(result.address).toEqual(address);
  });

  it('should throw NotFoundException if address does not exist', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const useCase = new FindAddressByIdUseCase(addressRepository);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
