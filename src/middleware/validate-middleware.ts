import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "utils/api-error";

export default function (req: Request, res: Response, next: NextFunction) {
  const validation = validationResult(req);

  const errors: { [key: string]: string } = {};

  validation.array().forEach(error => {
    if (error.type === "field") {
      const existedKey = Object.keys(errors);

      if (existedKey.includes(error.path)) {
        return;
      }

      errors[error.path] = error.msg;
    }
  });

  if (!validation.isEmpty()) {
    throw ApiError.ValidateError(errors);
  }

  next();
}
