import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsObject,
} from 'class-validator';
import { PayoutStatus } from '@prisma/client';

export class CreatePayoutDto {
  @IsNotEmpty()
  @IsString()
  creatorPayoutConfigId: string;

  @IsNotEmpty()
  @IsEnum(PayoutStatus)
  status: PayoutStatus;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  processedAt?: string;

  @IsOptional()
  @IsString()
  providerPayoutId?: string;

  @IsOptional()
  @IsObject()
  rawPayload?: Record<string, any>;
}
