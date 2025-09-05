import { InMemoryAddressRepository } from '@test/in-memory-address.repository';
import { UpdateAddressUseCase } from '@application/address/use-cases/update-address.use-case';
import { CreateAddressUseCase } from '@application/address/use-cases/create-address.use-case';
import { AddressType } from '@core/addresses/entities/address.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateAddress', () => {
  it('should be able to update address', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const createAddressUseCase = new CreateAddressUseCase(addressRepository);
    const updateAddressUseCase = new UpdateAddressUseCase(addressRepository);

    const dto = {
      userId: 'userId-1',
      type: AddressType.RESIDENTIAL,
      street: 'Alameda das Araras',
      number: '12345678',
      complement: 'Qd 29 Lt 16',
      district: 'Jardim das Araras',
      city: 'Aparecida de Goiania',
      state: 'GO',
      postalCode: '74971891',
      country: 'BR',
    };

    const { address: created } = await createAddressUseCase.execute(dto);

    const { address: updated } = await updateAddressUseCase.execute(
      {
        type: AddressType.COMMERCIAL,
        number: '1274',
        street: 'Cotton Baby',
      },
      created.id,
    );

    expect(updated).toBeTruthy();
    expect(updated).toBeDefined();
    expect(updated.number).toBe('1274');
    expect(updated.street).toBe('Cotton Baby');
    expect(updated.city).toBe('Aparecida de Goiania');
  });

  it('should throw NotFoundException if address does not exist', async () => {
    const addressRepository = new InMemoryAddressRepository();
    const updateAddressUseCase = new UpdateAddressUseCase(addressRepository);

    await expect(
      updateAddressUseCase.execute(
        {
          street: 'Notfound Street',
          number: '000',
        },
        'invalid-id',
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
