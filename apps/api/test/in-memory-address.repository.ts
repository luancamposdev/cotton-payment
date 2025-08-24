import { AddressRepository } from '@core/addresses/repository/address.repository';
import { AddressEntity } from '@core/addresses/entities/address.entity';

export class InMemoryAddressRepository implements AddressRepository {
  addresses: AddressEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(address: AddressEntity): Promise<void> {
    this.addresses.push(address);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<AddressEntity | null> {
    return this.addresses.find((a) => a.id === id) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findManyByUserId(userId: string): Promise<AddressEntity[]> {
    return this.addresses.filter((a) => a.userId === userId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(address: AddressEntity): Promise<void> {
    const index = this.addresses.findIndex((a) => a.id === address.id);
    if (index === -1) {
      throw new Error('Address not found');
    }

    this.addresses[index] = address;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<void> {
    const index = this.addresses.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Address not found');
    }
    this.addresses.splice(index, 1);
  }
}
