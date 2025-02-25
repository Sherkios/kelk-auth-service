import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import AuthService from 'src/auth/auth.service';
import SignInDto from 'src/auth/dto/SignInDto';
import { IAuthRespone } from 'src/auth/types/auth.interface';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto): Promise<IAuthRespone> {
    const token = await this.authService.signIn(signInDto);

    return {
      access_token: token,
    };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Headers('authorization') authHeader: string): Promise<void> {
    const token = authHeader.split(' ')[1];
    await this.authService.logout(token);
  }
}
