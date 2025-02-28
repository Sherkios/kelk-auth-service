import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class UserDto implements User {
  id: number;

  login: string;

  name: string;

  lastName: string;

  email: string;

  @Exclude()
  password: string;

  role: Role;

  @Exclude()
  isActivate: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
