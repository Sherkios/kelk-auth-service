import environment from "config/environment";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function generateAccessToken(id: number) {
  const payload = {
    id,
  };

  return jwt.sign(payload, environment.jwtToken, { expiresIn: "1h" });
}

export function generateRefreshToken(id: number) {
  const payload = {
    id,
  };

  return jwt.sign(payload, environment.jwtToken, { expiresIn: "12h" });
}

export function getVerifyToken(token: string) {
  return jwt.verify(token, environment.jwtToken);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = 10;
  const passwordHash: string = await bcrypt.hash(password, salt);

  return passwordHash;
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isCorrect = await bcrypt.compare(password, hashedPassword);

  return isCorrect;
}
