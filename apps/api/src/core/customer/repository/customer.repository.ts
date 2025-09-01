import { CustomerEntity } from '@core/customer/entities/customer.entity';

export abstract class CustomerRepository {
  abstract create(customer: CustomerEntity): Promise<void>;
  abstract findById(id: string): Promise<CustomerEntity | null>;
  abstract findByUserId(userId: string): Promise<CustomerEntity | null>;
  abstract save(customer: CustomerEntity): Promise<void>;
}
