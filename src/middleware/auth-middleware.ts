import { Request, Response, NextFunction } from "express";
import JwtService from "src/service/jwt.service";

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Пользователь не авторизован" });
    } else {
      const decodedData = JwtService.getVerifyAccessToken(token);

      req.body.user = decodedData;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Пользователь не авторизован" });
  }
}
