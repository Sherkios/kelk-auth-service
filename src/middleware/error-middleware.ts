import { NextFunction, Request, Response } from "express";
import ApiError from "utils/api-error";
import logger from "utils/logger";

export default function (error: Error | ApiError, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message, errors: error.errors });
    return;
  }

  logger.error("Internal Server Error:", error);

  res.status(500).json({ message: "Internal Server Error" });
}
