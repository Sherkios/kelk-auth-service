import { Role } from '@prisma/client';

export interface IJwtPayload {
  id: number;
  login: string;
  role: Role;
}

export interface IAuthRespone {
  access_token: string;
}
