import { Request } from 'express';
import { UserEntity } from '@core/users/entities/user.entity';

export interface AuthRequest extends Request {
  user: UserEntity;
}
