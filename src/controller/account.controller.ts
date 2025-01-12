import { Response, Request, NextFunction } from "express";
import AccountService from "service/account.service";
import RedisService from "service/redis.service";
import AccountModel from "src/model/account.model";
import JwtService from "src/service/jwt.service";
import ApiError from "utils/api-error";

export default class AccountController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;

      const existingAccount = await AccountModel.findByLogin(login);

      if (existingAccount) {
        throw ApiError.BadRequest("Логин уже занят");
      }

      const hashedPassword = await AccountService.hashPassword(password);

      const newAccount = await AccountModel.createAccount(login, hashedPassword);

      res.status(201).json(newAccount);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;

      if (login !== "" && password) {
        const account = await AccountModel.findByLogin(login);

        if (account) {
          const isCorrectPassword: boolean = await AccountService.checkPassword(
            password,
            account.password,
          );
          if (isCorrectPassword) {
            const token = JwtService.generateToken({ id: account.id });

            res.status(200).json({ token });
            return;
          }
        }
      }

      throw ApiError.BadRequest("Неверный логин или пароль");
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        RedisService.hSet("token:blacklist", token, token, 86400);
        res.status(200).json({ message: "Пользователь вышел" });
        return;
      }
      throw ApiError.UnauthorizedError();
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body.user;

      const key = `account:${id}:refreshToken`;
      const refreshToken = await RedisService.get(key);

      if (refreshToken) {
        const token = JwtService.generateToken({ id });

        await RedisService.delete(key);

        res.status(200).json({ token });
        return;
      }

      throw ApiError.UnauthorizedError();
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const validateId = Number(id) || null;

      if (validateId !== null) {
        const account = await AccountModel.findById(Number(validateId));

        if (account) {
          const { password, ...otherAcountValue } = account;

          res.status(200).json(otherAcountValue);
        } else {
          throw ApiError.BadRequest("Пользователя с таким id не существует");
        }
      } else {
        throw ApiError.BadRequest("Не корректный id");
      }
    } catch (error) {
      next(error);
    }
  }
}
