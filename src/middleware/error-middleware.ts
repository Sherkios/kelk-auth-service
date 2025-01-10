import { NextFunction, Request, Response } from "express";
import ApiError from "utils/api-error";

export default function (error: Error | ApiError, req: Request, res: Response, next: NextFunction) {
  console.log(error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message, errors: error.errors });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
}
