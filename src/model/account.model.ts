import pool from "db/db";
import { IAccount } from "src/types/account.types";

export default class AccountModel {
  static async createAccount(
    login: string,
    password: string,
    email: string,
  ): Promise<Pick<IAccount, "id">> {
    const result = await pool.query(
      "INSERT INTO accounts (login, password, email) values ($1, $2, $3) RETURNING id",
      [login, password, email],
    );
    return result.rows[0];
  }

  static async findByLogin(login: string): Promise<IAccount | null> {
    const result = await pool.query("SELECT * FROM accounts WHERE login = $1", [login]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<IAccount | null> {
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<IAccount | null> {
    const query: string = "SELECT * FROM accounts where id = $1";
    const value = [id];
    const result = await pool.query(query, value);

    return result.rows[0] || null;
  }

  static async updatePassword(id: number, hashedPassword: string): Promise<void> {
    const query: string = "UPDATE accounts SET password = $1 WHERE id = $2";
    const values = [hashedPassword, id];

    await pool.query(query, values);
  }
}
