import { Router } from "express";
import validateMiddleware from "middleware/validate-middleware";
import AccountController from "src/controller/account.controller";
import authMiddleware from "src/middleware/auth-middleware";
import registerSchema from "src/validators/registerSchema";
import getByIdSchema from "validators/getByIdSchema";

const accountRouter = Router();

accountRouter.post("/account", registerSchema, validateMiddleware, AccountController.register);

accountRouter.post("/account/login", AccountController.login);
accountRouter.post("/account/logout", authMiddleware, AccountController.logout);
accountRouter.get("/account/refresh", authMiddleware, AccountController.refreshToken);

accountRouter.get(
  "/account/:id",
  authMiddleware,
  getByIdSchema,
  validateMiddleware,
  AccountController.getById,
);

export default accountRouter;
