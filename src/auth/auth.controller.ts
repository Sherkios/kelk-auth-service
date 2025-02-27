import { Body, Controller, Headers, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common';
import AuthGuard from 'src/auth/auth.guard';
import AuthService from 'src/auth/auth.service';
import { signInSchema } from 'src/auth/dto/sign-in.schema';
import SignInDto from 'src/auth/dto/SignInDto';
import { IAuthRespone } from 'src/auth/types/auth.interface';
import { JoiValidationPipe } from 'src/join-valiation.pipe';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signIn(@Body() signInDto: SignInDto): Promise<IAuthRespone> {
    const token = await this.authService.signIn(signInDto);

    return {
      accessToken: token,
    };
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async logout(@Headers('authorization') authHeader: string): Promise<void> {
    const token = authHeader.split(' ')[1];
    await this.authService.logout(token);
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    const newAccessToken = await this.authService.getRefreshedToken(token);

    return {
      accessToken: newAccessToken,
    };
  }
}
