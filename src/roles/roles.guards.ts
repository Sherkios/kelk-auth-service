import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { IJwtPayload } from 'src/auth/types/auth.interface';
import { ROLES_KEY } from 'src/roles/roles.decorator';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<Request & { user: IJwtPayload }>();

    if (!user) throw new UnauthorizedException();

    const isValid = requiredRoles.some(role => user.role === role);

    if (!isValid) throw new ForbiddenException();

    return true;
  }
}
