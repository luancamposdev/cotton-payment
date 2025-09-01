import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsInt,
  Min,
} from 'class-validator';

export type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

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

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
  billingInterval: BillingInterval;

  @IsInt()
  @IsOptional()
  @Min(0)
  trialDays: number | null;
}
