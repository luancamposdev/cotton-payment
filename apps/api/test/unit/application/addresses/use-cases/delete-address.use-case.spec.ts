import { InMemoryAddressRepository } from '@test/in-memory-address.repository';
import { CreateAddressUseCase } from '@application/address/create-address.use-case';
import { DeleteAddressUseCase } from '@application/address/delete-address.use-case';
import { AddressType } from '@core/addresses/entities/address.entity';

describe('DeleteAddressUseCase', () => {
  it('Should be able to delete an address', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const createAddressUseCase = new CreateAddressUseCase(addressRepository);
    const deleteAddressUseCase = new DeleteAddressUseCase(addressRepository);

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

    await deleteAddressUseCase.execute(address.id);

    expect(addressRepository.addresses).toHaveLength(0);
    expect(addressRepository.addresses).not.toContain(address);
  });

  it('Should throw an error if the address does not exist', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const deleteAddressUseCase = new DeleteAddressUseCase(addressRepository);

    const addressId = 'non-existent-address-id';

    await expect(deleteAddressUseCase.execute(addressId)).rejects.toThrow(
      `Endereço não encontrado.`,
    );
  });
});
