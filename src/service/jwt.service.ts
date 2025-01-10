import environment from "config/environment";
import jwt from "jsonwebtoken";
import RedisService from "service/redis.service";
import { IJwtPayload } from "types/jwt.types";

export default class JwtService {
  public static generateToken(payload: IJwtPayload) {
    const accessToken = jwt.sign(payload, environment.jwtAccessToken, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, environment.jwtRefreshToken, { expiresIn: "1d" });

    RedisService.set(`account:accessToken:${accessToken}`, refreshToken, 86400);
    return accessToken;
  }

  public static getVerifyAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, environment.jwtAccessToken) as IJwtPayload;
  }

  public static getVerifyRefreshToken(token: string): IJwtPayload {
    return jwt.verify(token, environment.jwtRefreshToken) as IJwtPayload;
  }
}
