import bcrypt from "bcrypt";

export default class AccountService {
  public static async hashPassword(password: string): Promise<string> {
    const salt = 10;
    const passwordHash: string = await bcrypt.hash(password, salt);

    return passwordHash;
  }

  public static async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isCorrect = await bcrypt.compare(password, hashedPassword);

    return isCorrect;
  }
}
