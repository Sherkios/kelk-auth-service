import { Request, Response, NextFunction } from "express";
import JwtService from "src/service/jwt.service";
import ApiError from "utils/api-error";

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw ApiError.UnauthorizedError();
    } else {
      const decodedData = JwtService.getVerifyAccessToken(token);

      req.body.user = decodedData;
      next();
    }
  } catch (error) {
    next(error);
  }
}
