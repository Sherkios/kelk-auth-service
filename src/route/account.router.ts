import { Router } from "express";
import AccountController from "src/controller/account.controller";

const accountRouter = Router();

accountRouter.post("/account", AccountController.register);
accountRouter.get("/account", AccountController.getAll);

export default accountRouter;
