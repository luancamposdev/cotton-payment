import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { BillingInterval } from '@prisma/client';

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(BillingInterval)
  billingInterval: BillingInterval;

  @IsInt()
  @IsOptional()
  @Min(0)
  trialDays: number | null;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  features: string[];
}
