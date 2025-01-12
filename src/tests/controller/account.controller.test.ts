import { Request, Response } from "express";
import AccountModel from "model/account.model";
import AccountService from "service/account.service";
import JwtService from "service/jwt.service";
import RedisService from "service/redis.service";
// import RedisService from "service/redis.service";
import AccountController from "src/controller/account.controller";
import ApiError from "utils/api-error";

jest.mock("model/account.model", () => ({
  findByLogin: jest.fn(),
  findById: jest.fn(),
  createAccount: jest.fn(),
}));
jest.mock("service/account.service");
jest.mock("service/jwt.service", () => ({
  generateToken: jest.fn(),
}));
jest.mock("service/redis.service", () => ({
  hSet: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

describe("AccountController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        login: "testuser",
        password: "password123",

        user: {
          id: 1,
        },
      },
      params: {
        id: "1",
      },
      headers: {
        authorization: "Bearer validtoken",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("Должен вызвать next с ошибков ApiError, со статусом 400", async () => {
      (AccountModel.findByLogin as jest.Mock).mockResolvedValue(true);

      await AccountController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      // Дополнительно проверяем свойства ошибки
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });

    it("Создание нового пользователя и возврат его id", async () => {
      (AccountModel.findByLogin as jest.Mock).mockResolvedValue(false);
      (AccountModel.createAccount as jest.Mock).mockResolvedValue({ id: 1 });
      (AccountService.hashPassword as jest.Mock).mockResolvedValue("hashedPassword");

      await AccountController.register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("login", () => {
    it("Вызов ошибки, если не найден пользователь со статусом 400", async () => {
      (AccountModel.findByLogin as jest.Mock).mockResolvedValue(false);

      await AccountController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });

    it("Вызов ошибки, если не совпадает пароль со статусом 400", async () => {
      (AccountModel.findByLogin as jest.Mock).mockResolvedValue(true);
      (AccountService.checkPassword as jest.Mock).mockResolvedValue(false);

      await AccountController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });

    it("Получение токена при успешной попытке авторизоваться", async () => {
      (AccountModel.findByLogin as jest.Mock).mockResolvedValue(true);
      (AccountService.checkPassword as jest.Mock).mockResolvedValue(true);
      (JwtService.generateToken as jest.Mock).mockReturnValue("token");

      await AccountController.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });
  });

  describe("logout", () => {
    it("Вызов ошибки, если не передан токен", async () => {
      req.headers = {
        authorization: "",
      };

      await AccountController.logout(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      const error = next.mock.calls[0][0];

      expect(error.statusCode).toBe(401);
    });

    it("Успешный выход пользователя", async () => {
      (RedisService.hSet as jest.Mock).mockResolvedValue(true);

      await AccountController.logout(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("refreshToken", () => {
    it("Вызов ошибки, если истек рефреш токен или отсутствует", async () => {
      (RedisService.get as jest.Mock).mockResolvedValue(false);

      await AccountController.refreshToken(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      const error = next.mock.calls[0][0];

      expect(error.statusCode).toBe(401);
    });

    it("Успешное получение нового токена", async () => {
      (RedisService.get as jest.Mock).mockResolvedValue(true);
      (RedisService.delete as jest.Mock).mockResolvedValue(true);
      (JwtService.generateToken as jest.Mock).mockReturnValue("token");

      await AccountController.refreshToken(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });
  });

  describe("getById", () => {
    it("Вызов ошибки если нет запрашеваемого аккаунта", async () => {
      (AccountModel.findById as jest.Mock).mockResolvedValue(false);

      await AccountController.getById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      const error = next.mock.calls[0][0];

      expect(error.statusCode).toBe(400);
    });

    it("Получение запрашеваемого пользователя", async () => {
      (AccountModel.findById as jest.Mock).mockResolvedValue({
        id: 1,
        login: "login",
        password: "password",
      });

      await AccountController.getById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        login: "login",
      });
    });
  });
});
