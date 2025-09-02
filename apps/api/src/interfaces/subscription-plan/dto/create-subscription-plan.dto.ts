import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsInt,
  Min,
  ArrayNotEmpty,
  IsArray,
  ArrayUnique,
} from 'class-validator';

export enum BillingInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

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
  trialDays?: number | null;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}
