import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@core/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRequest } from '@/common/types/request.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthRequest>();

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
