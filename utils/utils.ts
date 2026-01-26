import jwt, { SignOptions } from "jsonwebtoken";
import { TokenType } from "../typing/types";

const getToken = (userId: number, tokenType: TokenType): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const TOKEN_EXP_INT = process.env.JWT_TOKEN_EXPIRATION_INTERVAL
  const REFRESH_TOKEN_EXP_INT = process.env.JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  };

  if (!TOKEN_EXP_INT) {
    throw new Error("JWT_TOKEN_EXPIRATION_INTERVAL is not defined");
  };

  if (!REFRESH_TOKEN_EXP_INT) {
    throw new Error("JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL is not defined");
  };

  let expiresIn: SignOptions["expiresIn"];

  if (tokenType === "token") {
    expiresIn = TOKEN_EXP_INT as SignOptions["expiresIn"];
  } else {
    expiresIn = REFRESH_TOKEN_EXP_INT as SignOptions["expiresIn"];
  };

  const payload = {
    userId,
    tokenType
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};


export { 
  getToken
 };