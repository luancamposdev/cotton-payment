import {
  IsOptional,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsEmail,
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

  role?: Role;
}
