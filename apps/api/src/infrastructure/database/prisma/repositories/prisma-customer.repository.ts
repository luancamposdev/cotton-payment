import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { CustomerEntity } from '@core/customer/entities/customer.entity';
import { PrismaCustomerMapper } from '@infrastructure/database/prisma/mappers/prisma-customer.mapper';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(customer: CustomerEntity): Promise<void> {
    const userExists = await this.prismaService.users.findUnique({
      where: { id: customer.userId },
    });

    if (!userExists) {
      throw new NotFoundException(
        `Usuário com id ${customer.userId} não encontrado`,
      );
    }

    await this.prismaService.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    });
  }

  async findByUserId(userId: string): Promise<CustomerEntity | null> {
    const raw = await this.prismaService.customer.findUnique({
      where: { userId },
      include: { defaultAddress: true },
    });

    if (!raw) return null;

    return new CustomerEntity(
      {
        userId: raw.userId,
        defaultAddressId: raw.defaultAddressId,
      },
      raw.id,
    );
  }

  async save(customer: CustomerEntity): Promise<void> {
    await this.prismaService.customer.update({
      where: { id: customer.id },
      data: {
        defaultAddressId: customer.defaultAddressId,
      },
    });
  }
}
