import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from '@/interfaces/customer/dto/create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  defaultAddressId: string | null;
}
