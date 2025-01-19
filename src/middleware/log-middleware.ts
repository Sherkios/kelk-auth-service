import { NextFunction, Request, Response } from "express";
import logger from "utils/logger";

export default function (req: Request, res: Response, next: NextFunction) {
  logger.info({
    message: "Request",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  next();
}
