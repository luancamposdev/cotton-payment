import { Injectable } from '@nestjs/common';
import { CustomerEntity } from '@core/customer/entities/customer.entity';

@Injectable()
export class InMemoryCustomerRepository {
  private customer: CustomerEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(customer: CustomerEntity): Promise<void> {
    this.customer.push(customer);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<CustomerEntity | null> {
    return this.customer.find((c) => c.id === id) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByUserId(userId: string): Promise<CustomerEntity | null> {
    return this.customer.find((c) => c.userId === userId) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(creator: CustomerEntity): Promise<void> {
    const index = this.customer.findIndex((c) => c.id === creator.id);
    if (index !== -1) {
      this.customer[index] = creator;
    }
  }
}
