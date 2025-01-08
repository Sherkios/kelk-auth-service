import pool from "db/db";
import { IAccount } from "src/types/account.types";

export default class AccountModel {
  static async createAccount(name: string): Promise<IAccount> {
    const result = await pool.query("INSERT INTO accounts (name) values ($1) RETURNING *", [name]);
    return result.rows[0];
  }

  static async findByName(name: string): Promise<IAccount | null> {
    const result = await pool.query("SELECT * FROM accounts WHERE name = $1", [name]);
    return result.rows[0] || null;
  }

  static async getAllAccount(): Promise<IAccount[] | null> {
    const result = await pool.query("SELECT * FROM accounts");

    if (result.rows.length) {
      return result.rows;
    }

    return null;
  }
}
