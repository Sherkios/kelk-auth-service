import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { TRequestWithUser } from 'src/auth/types/auth.interface';
import { ROLES_KEY } from 'src/roles/roles.decorator';

@Injectable()
export default class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<TRequestWithUser>();

    const { user } = request;
    if (!user) throw new UnauthorizedException();

    const paramId: number = Number(request.params.id);

    if (requiredRoles.includes(user.role) || paramId === user.id) return true;

    throw new ForbiddenException();
  }
}
