import { Injectable, NotFoundException } from '@nestjs/common';

import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { CustomerEntity } from '@core/customer/entities/customer.entity';

interface IUpdateCustomerRequest {
  userId: string;
  defaultAddressId?: string | null;
}

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}
  async execute({
    userId,
    defaultAddressId,
  }: IUpdateCustomerRequest): Promise<{ customer: CustomerEntity }> {
    const customer = await this.customerRepository.findByUserId(userId);

    if (!customer) {
      throw new NotFoundException(`Customer with userId ${userId} not found`);
    }

    if (!customer) {
      throw new NotFoundException('Customer not found for this user.');
    }

    if (defaultAddressId !== undefined) {
      customer.defaultAddressId = defaultAddressId;
    }

    await this.customerRepository.save(customer);

    return { customer };
  }
}
