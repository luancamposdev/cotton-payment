import { CustomerEntity } from '@core/customer/entities/customer.entity';

export abstract class CustomerRepository {
  abstract create(customer: CustomerEntity): Promise<void>;
  abstract findByUserId(userId: string): Promise<CustomerEntity | null>;
  abstract save(creator: CustomerEntity): Promise<void>;
}
