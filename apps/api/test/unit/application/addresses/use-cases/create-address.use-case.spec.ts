import { InMemoryAddressRepository } from '@test/in-memory-address.repository';
import { CreateAddressUseCase } from '@application/address/create-address.use-case';
import {
  AddressEntity,
  AddressType,
} from '@core/addresses/entities/address.entity';
import { CreateAddressDto } from '@/interfaces/addresses/dto/create-address.dto';
import { BadRequestException } from '@nestjs/common';

describe('Create Address Use Case', () => {
  it('should create an address successfully', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const createAddressUseCase = new CreateAddressUseCase(addressRepository);

    const dto = {
      userId: 'user-1',
      type: AddressType.RESIDENTIAL,
      street: '123 Main St',
      district: 'Downtown',
      city: 'Metropolis',
      state: 'NY',
      postalCode: '12345678',
    };

    const { address } = await createAddressUseCase.execute(dto);

    expect(address).toBeTruthy();
    expect(address.id).toBeDefined();
    expect(address.userId).toBe(dto.userId);
  });

  it('should throw BadRequestException when user has 5 addresses', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const createAddressUseCase = new CreateAddressUseCase(addressRepository);

    addressRepository.addresses = Array(5).fill(
      new AddressEntity({
        userId: 'user-123',
        type: AddressType.COMMERCIAL,
        district: '',
        street: 'Existing Street',
        city: 'CityVille',
        state: 'ST',
        postalCode: '12345-678',
      }),
    ) as AddressEntity[];

    const dto: CreateAddressDto = {
      userId: 'user-123',
      district: '',
      type: AddressType.RESIDENTIAL,
      street: 'New Street',
      city: 'Cityville',
      state: 'ST',
      postalCode: '87654-321',
    };

    await expect(createAddressUseCase.execute(dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
