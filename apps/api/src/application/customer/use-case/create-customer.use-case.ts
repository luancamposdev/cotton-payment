import { ConflictException, Injectable } from '@nestjs/common';

import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { CreateCustomerDto } from '@/interfaces/customer/dto/create-customer.dto';
import { CustomerEntity } from '@core/customer/entities/customer.entity';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<{ customer: CustomerEntity }> {
    const existing = await this.customerRepository.findByUserId(dto.userId);

    if (existing) {
      throw new ConflictException('Customer já cadastrado para este usuário');
    }

    const customer = new CustomerEntity({
      userId: dto.userId,
      defaultAddressId: dto.defaultAddressId,
    });

    await this.customerRepository.create(customer);

    return { customer };
  }
}
