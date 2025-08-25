import { CustomerEntity } from '@core/customer/entities/customer.entity';

export interface CustomerView {
  id: string;
  defaultAddressId: string | null;
}

export class CustomerViewModel {
  static toHTTP(customer: CustomerEntity): CustomerView {
    return {
      id: customer.id,
      defaultAddressId: customer.defaultAddressId,
    };
  }
}
