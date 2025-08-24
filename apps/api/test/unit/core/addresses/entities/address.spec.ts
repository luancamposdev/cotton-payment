import {
  AddressEntity,
  AddressType,
} from '@core/addresses/entities/address.entity';

describe('Address Entity', () => {
  it('should create a valid address', () => {
    const address = new AddressEntity({
      userId: 'user-123',
      type: AddressType.RESIDENTIAL,
      street: 'Rua Paraná',
      number: '100',
      district: 'Vila Brasilia',
      state: 'GO',
      city: 'Aparecida de Goiania',
      postalCode: '74971795',
      country: 'BR',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(address).toBeTruthy();
    expect(address).toBeDefined();
  });

  it('should throw an error for invalid postal code', () => {
    expect(
      () =>
        new AddressEntity({
          userId: 'user-123',
          type: AddressType.RESIDENTIAL,
          street: 'Rua Paraná',
          number: '100',
          district: 'Vila Brasilia',
          state: 'GO',
          city: 'Aparecida de Goiania',
          postalCode: 'invalid-postal',
          country: 'BR',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    ).toThrow();
  });
});
