import { AddressEntity } from '@/core/addresses/entities/address.entity';

export interface AddressView {
  id: string;
  type: string;
  street: string;
  number?: string | null;
  complement?: string | null;
  district?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string | null;
}

export class AddressViewModel {
  static toHTTP(address: AddressEntity): AddressView {
    return {
      id: address.id,
      type: address.type,
      street: address.street,
      number: address.number,
      complement: address.complement,
      district: address.district,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode.getValue,
      country: address.country.getValue,
    };
  }
}
