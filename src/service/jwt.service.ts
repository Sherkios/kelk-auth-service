import environment from "config/environment";
import jwt from "jsonwebtoken";

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
