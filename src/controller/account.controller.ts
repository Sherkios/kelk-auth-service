import { Response, Request } from "express";
import AccountModel from "src/model/account.model";

export default class AccountController {
  static async register(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(401).json({ message: "name must be not empty" });
        return;
      }

      const existingAccount = await AccountModel.findByName(name);

      if (existingAccount) {
        res.status(400).json({ message: "account arleady exists" });
        return;
      }

      const newacAount = await AccountModel.createAccount(name);

      res.status(201).json({ ...newacAount });
    } catch (error) {
      res.status(500).json({
        message: "Error create account",
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const accounts = await AccountModel.getAllAccount();

      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
}
