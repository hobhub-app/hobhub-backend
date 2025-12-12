import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { TokenPayload } from "./types.js";

export const hashPassword = async (userPassword: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  return hashedPassword;
};

export const verifyPassword = async (
  userPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(userPassword, hashedPassword);
  return isMatch;
};

export const generateToken = (userId: number, email: string): string => {
  const payload: TokenPayload = { userId, email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return token;
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
