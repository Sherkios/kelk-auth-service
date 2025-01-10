import { Response, Request } from "express";
import AccountService from "service/account.service";
import RedisService from "service/redis.service";
import AccountModel from "src/model/account.model";
import JwtService from "src/service/jwt.service";

export default class AccountController {
  static async register(req: Request, res: Response) {
    try {
      const { name, password } = req.body;

      if (!name && !password) {
        res.status(401).json({ message: "Name and password must be writen" });
        return;
      }

      const existingAccount = await AccountModel.findByName(name);

      if (existingAccount) {
        res.status(400).json({ message: "account arleady exists" });
        return;
      }

      const hashedPassword = await AccountService.hashPassword(password);

      const newAccount = await AccountModel.createAccount(name, hashedPassword);

      res.status(201).json(newAccount);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error create account",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      if (login !== "" && password) {
        const account = await AccountModel.findByName(login);

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

      res.status(400).json({ message: "Неверный логин или пароль" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const key = `account:accessToken:${token}`;
        const refreshToken = await RedisService.get(key);

        if (refreshToken) {
          const { id } = JwtService.getVerifyRefreshToken(refreshToken);
          const token = JwtService.generateToken({ id });

          await RedisService.delete(key);

          res.status(200).json({ token });
          return;
        }
      }

      res.status(401).json({ message: "Пользователь не авторизован" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const validateId = Number(id) || null;

      if (validateId !== null) {
        const account = await AccountModel.findById(Number(validateId));

        if (account) {
          const { password, ...otherAcountValue } = account;

          res.status(200).json(otherAcountValue);
        } else {
          res.status(400).json({ message: "Пользователя с таким id не существует" });
        }
      } else {
        res.status(400).json({ message: "Не корректный id" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}
