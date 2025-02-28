import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { jwtConstants } from 'src/auth/constants';
import { RegisterDto } from 'src/auth/dto/register-dto';
import SignInDto from 'src/auth/dto/SignInDto';
import { IAuthResponeWithId, IJwtPayload } from 'src/auth/types/auth.interface';
import CryptService from 'src/crypt/crypt.service';
import { PrismaService } from 'src/prisma.service';
import UserService from 'src/user/user.service';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private cryptService: CryptService,
    private configService: ConfigService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(signInDto: SignInDto): Promise<IAuthResponeWithId> {
    const user = await this.prisma.user.findFirst({
      where: { login: signInDto.login },
    });

    if (!user) throw new UnauthorizedException('Логин или пароль не верный');

    const compare = await this.cryptService.compare(signInDto.password, user.password);

    if (!compare) throw new UnauthorizedException('Логин или пароль не верный');

    const { accessToken } = await this.getToken(user);

    return { accessToken, id: user.id };
  }

  async logout(token: string) {
    await this.cacheManager.set(`token:blacklist:${token}`, token, 21_600_000);
  }

  async getRefreshedToken(accessToken: string): Promise<string> {
    const blacklistToken = await this.cacheManager.get(`token:blacklist:${accessToken}`);
    if (blacklistToken) throw new UnauthorizedException();

    // Получаем ключ рефреш
    const chacheKey = `refreshToken:${accessToken}`;
    const refreshToken = await this.cacheManager.get<string>(chacheKey);

    if (!refreshToken) throw new UnauthorizedException();

    // Проверяем действителен ли он
    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(refreshToken, {
        secret: jwtConstants(this.configService).secret,
      });

      if (!payload) throw new UnauthorizedException();

      // Удаляем старый рефреш ключ
      await this.cacheManager.del(chacheKey);

      // Получаем новый токен и устанавливаем новый рефреш ключ
      const { accessToken: newAccessToken } = await this.getToken(payload);

      return newAccessToken;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async getToken(object: User | IJwtPayload) {
    const jwtPayload: IJwtPayload = {
      id: object.id,
      login: object.login,
      role: object.role,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '6h',
    });

    await this.cacheManager.set(`refreshToken:${accessToken}`, refreshToken, 21_600_000);

    return { accessToken, refreshToken };
  }

  async createNewUser(registerDto: RegisterDto): Promise<User> {
    const newUser = await this.userService.createOne(registerDto);

    return newUser;
  }
}
