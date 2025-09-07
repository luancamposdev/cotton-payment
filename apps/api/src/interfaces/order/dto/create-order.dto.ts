// create-order.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  creatorId: string;

  @IsNumber()
  amount: number; // em centavos

  @IsString()
  @IsIn(['BRL', 'USD', 'EUR'])
  currency: string;

  @IsString()
  @IsOptional()
  description: string;
}
