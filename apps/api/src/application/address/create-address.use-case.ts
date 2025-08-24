import { AddressRepository } from '@core/addresses/repository/address.repository';
import { CreateAddressDto } from '@/interfaces/addresses/dto/create-address.dto';
import { BadRequestException } from '@nestjs/common';
import { AddressEntity } from '@core/addresses/entities/address.entity';

export class CreateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(dto: CreateAddressDto): Promise<{ address: AddressEntity }> {
    const existing = await this.addressRepository.findManyByUserId(dto.userId);

    if (existing.length >= 5) {
      throw new BadRequestException('Limite de endereços atingido');
    }

    const address = new AddressEntity({
      userId: dto.userId,
      type: dto.type,
      street: dto.street,
      number: dto.number,
      complement: dto.complement,
      district: dto.district,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.addressRepository.create(address);

    return { address };
  }
}
