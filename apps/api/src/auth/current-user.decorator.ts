import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@core/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

export const CurrentUser = createParamDecorator(
  (data: UserEntity, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
