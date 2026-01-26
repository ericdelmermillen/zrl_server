import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { TokenType } from "../typing/types";

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXP_INT = process.env.JWT_TOKEN_EXPIRATION_INTERVAL!;
const REFRESH_TOKEN_EXP_INT = process.env.JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL!;


const convertJWTExpirationToMs = (expiration: string): number => {
  const trimmedExpiration = expiration.trim();

  const expirationMatch = trimmedExpiration.match(/^(\d+)\s*([smhd])$/i);
  
  if (!expirationMatch) {
    throw new Error(
      `Invalid JWT expiration format: "${expiration}" (expected format "15m", "1d", "30s", "2h")`
    );
  };

  const amount = Number(expirationMatch[1]);
  const unit = expirationMatch[2].toLowerCase();

  const millisecondsPerUnit =
    unit === "s" ? 1000 :
    unit === "m" ? 60_000 :
    unit === "h" ? 3_600_000 :
    86_400_000; // "d"

  return amount * millisecondsPerUnit;
};

const getToken = (userId: number, tokenType: TokenType): string => {
  const expiresIn: SignOptions["expiresIn"] =
    tokenType === "token"
      ? (TOKEN_EXP_INT as SignOptions["expiresIn"])
      : (REFRESH_TOKEN_EXP_INT as SignOptions["expiresIn"]);

  return jwt.sign({ userId, tokenType }, JWT_SECRET, { expiresIn });
};

const clearAuthCookies = (res: Response, cookieOptions: {
  httpOnly: true;
  secure: boolean;
  sameSite: "none" | "lax";
  path: "/";
}) => {
  res.clearCookie("token", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

const setAuthCookies = (res: Response, userId: number,
  cookieOptions: {
    httpOnly: true;
    secure: boolean;
    sameSite: "none" | "lax";
    path: "/";
  },
  tokenCookieMaxAgeMs: number,
  refreshTokenCookieMaxAgeMs: number
) => {
  const token = getToken(userId, "token");
  const refreshToken = getToken(userId, "refreshToken");

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: tokenCookieMaxAgeMs,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: refreshTokenCookieMaxAgeMs,
  });
};


export {
  getToken,
  convertJWTExpirationToMs,
  clearAuthCookies,
  setAuthCookies
};
