import { Module } from '@nestjs/common';
import AuthService from 'src/auth/auth.service';
import CryptService from 'src/crypt/crypt.service';
import { PrismaService } from 'src/prisma.service';
import UserController from 'src/user/user.controller';
import UserService from 'src/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, CryptService],
  exports: [UserService],
})
export default class UserModule {}
