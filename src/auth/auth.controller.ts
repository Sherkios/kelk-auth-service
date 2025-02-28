import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import AuthGuard from 'src/auth/auth.guard';
import AuthService from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/register-dto';
import { registerSchema } from 'src/auth/dto/register.schema';
import { signInSchema } from 'src/auth/dto/sign-in.schema';
import SignInDto from 'src/auth/dto/SignInDto';
import { IAuthRespone, IAuthResponeWithId } from 'src/auth/types/auth.interface';
import CryptService from 'src/crypt/crypt.service';
import { JoiValidationPipe } from 'src/join-valiation.pipe';
import UserDto from 'src/user/dto/user.dto';

@Controller('auth')
export default class AuthController {
  constructor(
    private authService: AuthService,
    private cryptService: CryptService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signIn(@Body() signInDto: SignInDto): Promise<IAuthResponeWithId> {
    const token = await this.authService.signIn(signInDto);

    return token;
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async logout(@Headers('authorization') authHeader: string): Promise<void> {
    const token = authHeader.split(' ')[1];
    await this.authService.logout(token);
  }

  @Get('refresh')
  async refreshToken(@Headers('authorization') authHeader: string): Promise<IAuthRespone> {
    const token = authHeader.split(' ')[1];
    const newAccessToken = await this.authService.getRefreshedToken(token);

    return {
      accessToken: newAccessToken,
    };
  }

  @Post('registration')
  @UsePipes(new JoiValidationPipe(registerSchema))
  async registrentionUser(@Body() registerDto: RegisterDto): Promise<UserDto> {
    registerDto.password = await this.cryptService.hash(registerDto.password);
    const newUser = await this.authService.createNewUser(registerDto);

    const result = plainToInstance(UserDto, newUser);

    return result;
  }
}
