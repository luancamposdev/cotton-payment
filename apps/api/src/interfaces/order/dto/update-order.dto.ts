// update-order.dto.ts
import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class UpdateOrderDTO {
  @IsString()
  @IsOptional()
  creatorId: string | null;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsIn(['BRL', 'USD', 'EUR'])
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['PENDING', 'PAID', 'FAILED', 'CANCELLED'])
  @IsOptional()
  status: string;
}
