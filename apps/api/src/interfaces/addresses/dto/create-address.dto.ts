import { AddressType } from '@core/addresses/entities/address.entity';

export class CreateAddressDto {
  userId: string;
  type: AddressType;
  street: string;
  number?: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}
