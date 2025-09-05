import { Injectable, NotFoundException } from '@nestjs/common';

import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { CustomerEntity } from '@core/customer/entities/customer.entity';

interface FindCustomerByUserIdRequest {
  userId: string;
}

@Injectable()
export class FindCustomerByUserIdUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}
  async execute({
    userId,
  }: FindCustomerByUserIdRequest): Promise<{ customer: CustomerEntity }> {
    const customer = await this.customerRepository.findByUserId(userId);

    if (!customer) throw new NotFoundException('Não foi encontrado o cliente.');

    return { customer };
  }
}
