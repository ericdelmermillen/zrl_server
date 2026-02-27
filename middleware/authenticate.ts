import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { setAuthCookies, clearAuthCookies } from "../utils/utilFunctions";
import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS } from "../utils/constants";
import { cookieOptions } from "../utils/configObjs";

const JWT_SECRET = process.env.JWT_SECRET!;

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token as string | undefined;
  const refreshToken = req.cookies?.refreshToken as string | undefined;

  if (!refreshToken) {
    clearAuthCookies(res, cookieOptions);
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  };

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        tokenType: string;
      };

      if (decoded.tokenType !== "token") {
        clearAuthCookies(res, cookieOptions);
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      };

      setAuthCookies(
        res,
        decoded.userId,
        cookieOptions,
        TOKEN_COOKIE_MAX_AGE_MS,
        REFRESH_COOKIE_MAX_AGE_MS
      );

      return next();
    } catch {
      // access token expired or invalid, fall through to refresh token
        return null;
    };
  };

  try {
    const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: number;
      tokenType: string;
    };

    if (decodedRefreshToken.tokenType !== "refreshToken") {
      clearAuthCookies(res, cookieOptions);
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    };

    setAuthCookies(
      res,
      decodedRefreshToken.userId,
      cookieOptions,
      TOKEN_COOKIE_MAX_AGE_MS,
      REFRESH_COOKIE_MAX_AGE_MS
    );

    return next();
  } catch {
    clearAuthCookies(res, cookieOptions);
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  };
};

export { authenticate };