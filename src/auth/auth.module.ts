import { Module } from '@nestjs/common';
import AuthController from 'src/auth/auth.controller';
import AuthGuard from 'src/auth/auth.guard';
import AuthService from 'src/auth/auth.service';
import CryptService from 'src/crypt/crypt.service';
import { PrismaService } from 'src/prisma.service';
import UserService from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, CryptService, AuthGuard, UserService],
  exports: [AuthGuard],
})
export default class AuthModule {}
