import { InMemoryAddressRepository } from '@test/in-memory-address.repository';
import { FindAddressesByUserIdUseCase } from '@application/address/find-addresses-by-user-id.use-case';
import {
  AddressEntity,
  AddressType,
} from '@core/addresses/entities/address.entity';

describe('FindAddressesByUserIdUseCase', () => {
  it('should return all addresses for a given user', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const useCase = new FindAddressesByUserIdUseCase(addressRepository);

    const userId = 'user-1';
    const addresses = [
      new AddressEntity({
        userId,
        type: AddressType.RESIDENTIAL,
        street: 'Street A',
        district: 'District A',
        city: 'City A',
        state: 'ST',
        postalCode: '12345678',
        country: 'BR',
      }),
      new AddressEntity({
        userId,
        type: AddressType.COMMERCIAL,
        street: 'Street B',
        district: 'District B',
        city: 'City B',
        state: 'ST',
        postalCode: '87654321',
        country: 'BR',
      }),
    ];

    addressRepository.addresses = addresses;

    const result = await useCase.execute({ id: userId });

    expect(result.addresses).toEqual(addresses);
  });

  it('should return empty array if user has no addresses', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const useCase = new FindAddressesByUserIdUseCase(addressRepository);

    const result = await useCase.execute({ id: 'unknown-user' });

    expect(result.addresses).toEqual([]);
  });
});
