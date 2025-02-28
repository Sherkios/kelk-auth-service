import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { jwtConstants } from 'src/auth/constants';
import { IJwtPayload } from 'src/auth/types/auth.interface';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: jwtConstants(this.configService).secret,
      });

      if (!payload) throw new UnauthorizedException();

      request['user'] = payload;
      request['token'] = token;
    } catch {
      throw new UnauthorizedException();
    }

    const blacklistToken = await this.cacheManager.get<string>(`token:blacklist:${token}`);

    if (blacklistToken) throw new UnauthorizedException();

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
