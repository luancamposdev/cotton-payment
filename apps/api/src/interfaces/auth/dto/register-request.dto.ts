import { Role } from '@core/users/entities/user.entity';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  NotEquals,
} from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(Role)
  @NotEquals(Role.ADMIN, { message: 'Você não pode se registrar como admin' })
  role: Role.CUSTOMER;
}
