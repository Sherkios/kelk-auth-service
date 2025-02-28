import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/auth/dto/register-dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createOne(newUser: RegisterDto): Promise<User> {
    const userLogin = await this.findOneByLogin(newUser.login);
    if (userLogin) throw new BadRequestException('Логин уже занят');

    const userEmail = await this.findOneByEmail(newUser.email);
    if (userEmail) throw new BadRequestException('Почта уже занят');

    return await this.prisma.user.create({
      data: {
        ...newUser,
      },
    });
  }

  async deleteOne(id: number): Promise<void> {
    const exist = await this.findOneById(id);
    if (!exist) throw new BadRequestException('Пользователя с таким id не существует');
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
