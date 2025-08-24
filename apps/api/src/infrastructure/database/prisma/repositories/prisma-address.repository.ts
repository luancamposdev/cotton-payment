import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { PrismaAddressMapper } from '@infrastructure/database/prisma/mappers/prisma-address.mapper';

import { AddressRepository } from '@core/addresses/repository/address.repository';
import { AddressEntity } from '@core/addresses/entities/address.entity';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(address: AddressEntity): Promise<void> {
    const raw = PrismaAddressMapper.toPrisma(address);
    await this.prismaService.address.create({ data: raw });
  }

  async findById(id: string): Promise<AddressEntity | null> {
    const raw = await this.prismaService.address.findUnique({ where: { id } });
    if (!raw) return null;
    return PrismaAddressMapper.toDomain(raw);
  }

  async findManyByUserId(userId: string): Promise<AddressEntity[]> {
    const raws = await this.prismaService.address.findMany({
      where: { userId },
      include: { user: true },
    });

    return raws.map((raw) => PrismaAddressMapper.toDomain(raw));
  }

  async save(address: AddressEntity): Promise<void> {
    const raw = PrismaAddressMapper.toPrisma(address);
    const updated = await this.prismaService.address.update({
      where: { id: address.id },
      data: raw,
    });

    PrismaAddressMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.address.delete({ where: { id } });
  }
}
