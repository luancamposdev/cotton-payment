import { IsUUID, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  planId: string;

  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsDateString()
  renewalAt?: Date;
}
