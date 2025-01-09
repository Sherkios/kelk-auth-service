import { Router } from "express";
import AccountController from "src/controller/account.controller";

const accountRouter = Router();

accountRouter.post("/account", AccountController.register);

accountRouter.post("/account/login", AccountController.login);

accountRouter.get("/account/:id", AccountController.getById);

export default accountRouter;
