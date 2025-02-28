import { Role } from '@prisma/client';
import { Request } from 'express';

export interface IJwtPayload {
  id: number;
  login: string;
  role: Role;
}

export interface IAuthRespone {
  accessToken: string;
}

export interface IAuthResponeWithId extends IAuthRespone {
  id: number;
}

export type TRequestWithUser = Request & { user: IJwtPayload; token: string };
