import { Injectable, NotFoundException } from '@nestjs/common';

import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { CustomerEntity } from '@core/customer/entities/customer.entity';
import { UpdateCustomerDto } from '@/interfaces/customer/dto/update.customer.dto';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}
  async execute({
    userId,
    dto,
  }: {
    userId: string;
    dto: UpdateCustomerDto;
  }): Promise<{ customer: CustomerEntity }> {
    const customer = await this.customerRepository.findByUserId(userId);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado para este usuário.');
    }

    Object.assign(customer, dto);

    await this.customerRepository.save(customer);

    return { customer };
  }
}
