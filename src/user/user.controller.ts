import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import AuthGuard from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import RolesGuard from 'src/roles/roles.guards';
import UserGuard from 'src/user/user.guard';
import UserService from 'src/user/user.service';

@Controller('users')
@UseGuards(AuthGuard)
export default class UserController {
  constructor(private userService: UserService) {}

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
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    const user = await this.userService.findOne(id);

    if (!user) throw new BadRequestException('User with such id does not exist');

    return user;
  }
}
