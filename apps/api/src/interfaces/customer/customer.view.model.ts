import { CustomerEntity } from '@core/customer/entities/customer.entity';
import { AddressView } from '@/interfaces/addresses/address.view.model';

export interface CustomerView {
  id: string;
  defaultAddressId?: string | null;
  address?: AddressView | null;
}

export class CustomerViewModel {
  static toHTTP(
    customer: CustomerEntity,
    address?: AddressView | null,
  ): CustomerView {
    return {
      id: customer.id,
      defaultAddressId: customer.defaultAddressId,
      address: address ?? null,
    };
  }
}
