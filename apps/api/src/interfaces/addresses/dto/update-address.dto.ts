import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from '@/interfaces/addresses/dto/create-address.dto';
import { AddressType } from '@core/addresses/entities/address.entity';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  type?: AddressType;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
