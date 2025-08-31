import { AddressRepository } from '@core/addresses/repository/address.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddressEntity,
  AddressType,
} from '@core/addresses/entities/address.entity';

interface ICreateAddressRequest {
  userId: string;
  type: AddressType;
  street: string;
  number?: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

@Injectable()
export class CreateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(
    dto: ICreateAddressRequest,
  ): Promise<{ address: AddressEntity }> {
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
