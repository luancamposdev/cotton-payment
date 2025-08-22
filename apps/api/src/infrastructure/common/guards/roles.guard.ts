import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@core/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRequest } from '@infrastructure/common/types/request.types';

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

    const req = context.switchToHttp().getRequest<AuthRequest>();

    const user = req.user;

    if (!user || !user.role) {
      return false;
    }

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
