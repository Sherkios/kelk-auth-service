import { Request, Response, NextFunction } from "express";
import RedisService from "service/redis.service";
import JwtService from "src/service/jwt.service";
import ApiError from "utils/api-error";

export default async function (req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw ApiError.UnauthorizedError();
    } else {
      const blacklistToken = await RedisService.hGet("token:blacklist", token);

      if (blacklistToken) throw ApiError.UnauthorizedError();

      const decodedData = JwtService.getVerifyAccessToken(token);

      req.body.user = decodedData;
      next();
    }
  } catch (error) {
    next(error);
  }
}
