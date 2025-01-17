import { Router } from "express";
import validateMiddleware from "middleware/validate-middleware";
import AccountController from "src/controller/account.controller";
import authMiddleware from "src/middleware/auth-middleware";
import registerSchema from "src/validators/registerSchema";
import emailSchema from "validators/emailSchema";
import getByIdSchema from "validators/getByIdSchema";
import resetPasswordSchema from "validators/resetPasswordSchema";

const accountRouter = Router();

accountRouter.post("/account", registerSchema, validateMiddleware, AccountController.register);

accountRouter.post("/account/login", AccountController.login);
accountRouter.post("/account/logout", authMiddleware, AccountController.logout);

// сброс пароля
accountRouter.post(
  "/account/send-reset-password-mail",
  emailSchema,
  validateMiddleware,
  AccountController.sendResetPasswordMail,
);
accountRouter.post(
  "/account/reset-password",
  resetPasswordSchema,
  validateMiddleware,
  AccountController.resetPassword,
);

accountRouter.get("/account/refresh", authMiddleware, AccountController.refreshToken);
accountRouter.get(
  "/account/:id",
  authMiddleware,
  getByIdSchema,
  validateMiddleware,
  AccountController.getById,
);

export default accountRouter;
