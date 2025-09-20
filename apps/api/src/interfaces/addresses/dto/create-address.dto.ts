import { AddressType } from '@core/addresses/entities/address.entity';

export class CreateAddressDto {
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
