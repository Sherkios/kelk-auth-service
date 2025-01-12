import pool from "db/db";
import { IAccount } from "src/types/account.types";

export default class AccountModel {
  static async createAccount(login: string, password: string): Promise<IAccount> {
    const result = await pool.query(
      "INSERT INTO accounts (login, password) values ($1, $2) RETURNING id",
      [login, password],
    );
    return result.rows[0];
  }

  static async findByLogin(login: string): Promise<IAccount | null> {
    const result = await pool.query("SELECT * FROM accounts WHERE login = $1", [login]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<IAccount | null> {
    const query: string = "SELECT * FROM accounts where id = $1";
    const value = [id];
    const result = await pool.query(query, value);

    return result.rows[0] || null;
  }
}
