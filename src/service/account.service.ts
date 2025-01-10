import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = 10;
  const passwordHash: string = await bcrypt.hash(password, salt);

  return passwordHash;
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isCorrect = await bcrypt.compare(password, hashedPassword);

  return isCorrect;
}
