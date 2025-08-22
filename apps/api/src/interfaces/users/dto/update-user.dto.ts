import {
  IsOptional,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  NotEquals,
} from 'class-validator';

import { Role } from '@core/users/entities/user.entity';

export class UpdateUserDto {
  /**
   * O nome do usuário.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * A URL do avatar do usuário.
   */
  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(Role)
  @NotEquals(Role.ADMIN, { message: 'Você não é um administrador' })
  role: Role.CUSTOMER;
}
