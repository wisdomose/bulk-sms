import config from "./config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function makeOptional(schema: any) {
  const optionalSchema: any = {};
  for (const key in schema) {
    optionalSchema[key] = schema[key].optional();
  }
  return optionalSchema;
}

export async function comparePassword(password: string, hashed: string) {
  const samePassword = await bcrypt.compare(password, hashed);
  return samePassword;
}

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, config.SALT);
  return hash;
}

export function generateAccessToken<T extends Record<string, any>>(
  payload: T,
  exp: string | number
) {
  const token = jwt.sign(payload, config.SECRET, {
    expiresIn: exp,
  });

  return token;
}
