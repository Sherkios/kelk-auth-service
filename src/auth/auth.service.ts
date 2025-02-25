import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import SignInDto from 'src/auth/dto/SignInDto';
import { IJwtPayload } from 'src/auth/types/auth.interface';
import CryptService from 'src/crypt/crypt.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private cryptService: CryptService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { login: signInDto.login },
    });

    if (!user) throw new UnauthorizedException('Логин или пароль не верный');

    const compare = await this.cryptService.compare(signInDto.password, user.password);

    if (!compare) throw new UnauthorizedException('Логин или пароль не верный');

    const jwtPayload: IJwtPayload = {
      id: user.id,
      login: user.login,
      role: user.role,
    };

    const sign = this.jwtService.sign(jwtPayload, {
      expiresIn: '1h',
    });

    return sign;
  }

  async logout(token: string) {
    await this.cacheManager.set(`token:blacklist:${token}`, token, 8640);
  }
}
