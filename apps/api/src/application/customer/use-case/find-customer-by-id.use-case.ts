import { Injectable, NotFoundException } from '@nestjs/common';

import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { CustomerEntity } from '@core/customer/entities/customer.entity';

interface FindCustomerByUserIdRequest {
  id: string;
}

@Injectable()
export class FindCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}
  async execute({
    id,
  }: FindCustomerByUserIdRequest): Promise<{ customer: CustomerEntity }> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) throw new NotFoundException('Não foi encontrado o cliente.');

    return { customer };
  }
}
