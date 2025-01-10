import { Router } from "express";
import AccountController from "src/controller/account.controller";
import authMiddleware from "src/middleware/auth-middleware";

const accountRouter = Router();

accountRouter.post("/account", AccountController.register);

accountRouter.post("/account/login", AccountController.login);
accountRouter.get("/account/refresh", AccountController.refreshToken);

accountRouter.get("/account/:id", [authMiddleware], AccountController.getById);

export default accountRouter;
