import { Response, Request, NextFunction } from "express";
import AccountService from "service/account.service";
import MailService from "service/mail.service";
import RedisService from "service/redis.service";
import AccountModel from "src/model/account.model";
import JwtService from "src/service/jwt.service";
import ApiError from "utils/api-error";

export default class AccountController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password, email } = req.body;

      const existingAccount = await AccountModel.findByLogin(login);

      if (existingAccount) {
        throw ApiError.BadRequest("Логин уже занят");
      }

      const existingEmail = await AccountModel.findByEmail(email);

      if (existingEmail) {
        throw ApiError.BadRequest("Почта уже занята");
      }

      const hashedPassword = await AccountService.hashPassword(password);

      const newAccount = await AccountModel.createAccount(login, hashedPassword, email);

      res.status(201).json(newAccount);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;

      const account = await AccountModel.findByLogin(login);

      if (account) {
        const isCorrectPassword: boolean = await AccountService.checkPassword(
          password,
          account.password,
        );
        if (isCorrectPassword) {
          const token = JwtService.generateToken({ id: account.id, login: account.login });

          res.status(200).json({ token });
          return;
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
        res.status(204).send();
        return;
      }
      throw ApiError.UnauthorizedError();
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, login } = req.body.user;

      const key = `account:${id}:refreshToken`;
      const refreshToken = await RedisService.get(key);

      if (refreshToken) {
        const token = JwtService.generateToken({ id, login });

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

      const validateId = Number(id);

      const account = await AccountModel.findById(Number(validateId));

      if (account) {
        const { password, ...otherAcountValue } = account;

        res.status(200).json(otherAcountValue);
      } else {
        throw ApiError.BadRequest("Пользователя с таким id не существует");
      }
    } catch (error) {
      next(error);
    }
  }

  static async sendResetPasswordMail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const account = await AccountModel.findByEmail(email);

      if (!account) {
        throw ApiError.BadRequest("Пользователя с таким email не существует");
      }

      const token = JwtService.generateResetPasswordToken(
        { id: account.id, login: account.login },
        account.password,
      );

      await RedisService.set(`account:${account.id}:resetPasswordToken`, token, 3600);

      await MailService.sendMail(
        email,
        "Сброс пароля",
        `Ссылка для сброса пароля. Она действительна 1 час: (token: ${token}, email: ${email})`,
      );

      res.status(200).json({ message: "Ссылка для сброса пароля отправлена на почту" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, email } = req.query;
      const { password } = req.body;
      if (typeof token === "string" && email && typeof email === "string") {
        const account = await AccountModel.findByEmail(email);
        if (!account) {
          throw ApiError.BadRequest("Пользователя с таким email не существует");
        }

        const oldPassword = account.password;

        if (oldPassword === password) {
          throw ApiError.BadRequest("Новый пароль не должен совпадать с предыдущим");
        }

        const { id } = JwtService.getVerifyResetPasswordToken(token, oldPassword);

        const key = `account:${id}:resetPasswordToken`;
        const resetPasswordToken = await RedisService.get(key);

        if (resetPasswordToken === token) {
          const hashedPassword = await AccountService.hashPassword(password);

          await AccountModel.updatePassword(id, hashedPassword);

          res.status(200).json({ message: "Пароль успешно изменен" });
          return;
        }
      }

      throw ApiError.BadRequest(
        "Истекло время сброса пароля или недействительный токен, попробуйте снова",
      );
    } catch (error) {
      next(error);
    }
  }
}
