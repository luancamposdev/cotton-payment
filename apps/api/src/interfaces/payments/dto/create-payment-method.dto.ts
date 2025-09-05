import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  IsNumber,
} from 'class-validator';
import { PaymentProvider } from '@core/payments/entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsNotEmpty()
  @IsString()
  providerToken: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  last4?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expMonth?: number;

  @IsOptional()
  @IsNumber()
  @Min(2025) // ou algum ano mínimo
  expYear?: number;
}
