import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import AuthGuard from 'src/auth/auth.guard';
import AuthService from 'src/auth/auth.service';
import { TRequestWithUser } from 'src/auth/types/auth.interface';
import { Roles } from 'src/roles/roles.decorator';
import RolesGuard from 'src/roles/roles.guards';
import UserDto from 'src/user/dto/user.dto';
import UserGuard from 'src/user/user.guard';
import UserService from 'src/user/user.service';

@Controller('users')
@UseGuards(AuthGuard)
export default class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // TODO Реализовать пагинацию
  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getUsers() {
    const users = await this.userService.findAll();

    return users;
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(UserGuard)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto | null> {
    const user = await this.userService.findOneById(id);

    if (!user) throw new BadRequestException('User with such id does not exist');

    return plainToClass(UserDto, user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(UserGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: TRequestWithUser,
  ): Promise<void> {
    await this.userService.deleteOne(id);

    if (request.user.id === id) {
      await this.authService.logout(request.token);
    }
  }
}
