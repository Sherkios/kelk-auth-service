import environment from "config/environment";
import jwt from "jsonwebtoken";
import RedisService from "service/redis.service";
import { IJwtPayload } from "types/jwt.types";
import ApiError from "utils/api-error";

export default class JwtService {
  public static generateToken(payload: IJwtPayload) {
    const accessToken = jwt.sign(payload, environment.jwtAccessToken, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, environment.jwtRefreshToken, { expiresIn: "1d" });

    RedisService.set(`account:${payload.id}:refreshToken`, refreshToken, 86400);
    return accessToken;
  }

  public static getVerifyAccessToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, environment.jwtAccessToken) as IJwtPayload;
    } catch (error) {
      throw ApiError.UnauthorizedError();
    }
  }

  public static getVerifyRefreshToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, environment.jwtRefreshToken) as IJwtPayload;
    } catch (error) {
      throw ApiError.UnauthorizedError();
    }
  }
}
