import { Controller, Get, UseGuards } from '@nestjs/common';
import AuthGuard from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import RolesGuard from 'src/roles/roles.guards';

@Controller('users')
export default class UserController {
  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  getUsers() {
    return ['user', 'admin'];
  }
}
