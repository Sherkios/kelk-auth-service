import pool from "db/db";
import { IAccount } from "src/types/account.types";

export default class AccountModel {
  static async createAccount(name: string, password: string): Promise<IAccount> {
    const result = await pool.query(
      "INSERT INTO accounts (name, password) values ($1, $2) RETURNING id",
      [name, password],
    );
    return result.rows[0];
  }

  static async findByName(name: string): Promise<IAccount | null> {
    const result = await pool.query("SELECT * FROM accounts WHERE name = $1", [name]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<IAccount | null> {
    const query: string = "SELECT * FROM accounts where id = $1";
    const value = [id];
    const result = await pool.query(query, value);

    return result.rows[0] || null;
  }
}
