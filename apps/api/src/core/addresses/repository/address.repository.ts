import { AddressEntity } from '../entities/address.entity';

export abstract class AddressRepository {
  abstract create(address: AddressEntity): Promise<void>;
  abstract findById(id: string): Promise<AddressEntity | null>;
  abstract findManyByUserId(userId: string): Promise<AddressEntity[]>;
  abstract save(address: AddressEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
