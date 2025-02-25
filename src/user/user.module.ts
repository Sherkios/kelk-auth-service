import { Module } from '@nestjs/common';
import AuthGuard from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';
import RolesGuard from 'src/roles/roles.guards';
import UserController from 'src/user/user.controller';
import UserService from 'src/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthGuard, RolesGuard],
})
export default class UserModule {}
