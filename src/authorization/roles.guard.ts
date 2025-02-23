import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './roles.decorator';
import { SKIP_AUTH_KEY } from './skip.auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.isAuthSkipped(context)) return true;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (
      !requiredRoles.some((role) => {
        return user.role?.toLowerCase() === role?.toLowerCase();
      })
    ) {
      throw new ForbiddenException('User does not have required roles');
    }
    return true;
  }

  private isAuthSkipped(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
  }
}
