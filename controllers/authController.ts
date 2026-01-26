import { Request, Response } from "express";
import { 
  getToken, 
  clearAuthCookies,
  setAuthCookies,
  convertJWTExpirationToMs } from "../utils/utilFunctions";
import { 
  isProduction,
  TOKEN_COOKIE_MAX_AGE_MS,
  REFRESH_COOKIE_MAX_AGE_MS
  } from "../utils/constants";
import bcrypt from "bcrypt";
// ***
import jwt from "jsonwebtoken";
import pool from "../dbClient";


const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXP_INT = process.env.JWT_TOKEN_EXPIRATION_INTERVAL!;
const REFRESH_TOKEN_EXP_INT = process.env.JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL!;


// maxAge should be set separately for the token and refresh token
// should import this from somewhere since it will be used for all token rotating on all protected calls
const cookieOptions = {
  httpOnly: true,                // should be true in both envs
  secure: isProduction,          // HTTPS only in prod
  sameSite: isProduction ? "none" : "lax",
  path: "/",
} as const;

// POST /api/auth/createuser
const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string
  };

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const emailExists = await pool.query(
      "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
      [normalizedEmail]
    );

    if (emailExists.rowCount && emailExists.rowCount > 0) {
      return res.status(409).json({
        message: "A user with that email already exists",
      });
    };

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      `
      INSERT INTO users (email, hashed_password)
      VALUES ($1, $2)
      `,
      [normalizedEmail, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A user with that email already exists",
      });
    };
    console.error("Create user failed:", error);
    return res.status(500).json({ error: "Create user failed" });
  };
};


// ***
// POST /api/auth/sessionstatus
const checkSessionStatus = (req: Request, res: Response) => {
  const baseCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  } as const;

  const tokenCookieOptions = {
    ...baseCookieOptions,
    maxAge: convertJWTExpirationToMs(TOKEN_EXP_INT),
  };

  const refreshTokenCookieOptions = {
    ...baseCookieOptions,
    maxAge: convertJWTExpirationToMs(REFRESH_TOKEN_EXP_INT),
  };

  const clearAuthCookies = () => {
    res.clearCookie("token", baseCookieOptions);
    res.clearCookie("refreshToken", baseCookieOptions);
  };

  const setAuthCookies = (userId: number) => {
    const newToken = getToken(userId, "token");
    const newRefreshToken = getToken(userId, "refreshToken");

    res.cookie("token", newToken, tokenCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);
  };

  const token = req.cookies?.token as string | undefined;
  const refreshToken = req.cookies?.refreshToken as string | undefined;

  if (!token || !refreshToken) {
    clearAuthCookies();
    return res.status(401).json({
      message: "No active session",
      isAuthenticated: false,
    });
  }

  try {
    // 1. Try access token
    const decodedToken = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      tokenType: string;
    };

    if (decodedToken.tokenType !== "token") {
      clearAuthCookies();
      return res.status(401).json({
        message: "Invalid session token",
        isAuthenticated: false,
      });
    }

    // Rotate on success
    setAuthCookies(decodedToken.userId);

    return res.status(200).json({
      message: "User session active",
      isAuthenticated: true,
    });
  } catch {
    // 2. Access token failed → try refresh token
    try {
      const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET) as {
        userId: number;
        tokenType: string;
      };

      if (decodedRefreshToken.tokenType !== "refreshToken") {
        clearAuthCookies();
        return res.status(401).json({
          message: "Invalid refresh token",
          isAuthenticated: false,
        });
      }

      // Rotate on refresh success
      setAuthCookies(decodedRefreshToken.userId);

      return res.status(200).json({
        message: "User session active",
        isAuthenticated: true,
      });
    } catch {
      clearAuthCookies();
      return res.status(401).json({
        message: "Session expired",
        isAuthenticated: false,
      });
    }
  }
};





// const checkSessionStatus = async (req: Request, res: Response) => {
  
//   return res.json({message: "From sessionstaus"});
// };



// POST /api/auth/createuser
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const normalizedEmail = email.trim().toLowerCase();
  
  try {
    const result = await pool.query(
      `
      SELECT id, email, hashed_password
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    };

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    };

    const token = getToken(user.id, "token");
    const refreshToken = getToken(user.id, "refreshToken");


    res.cookie("token", token, { ...cookieOptions, maxAge: TOKEN_COOKIE_MAX_AGE_MS });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_COOKIE_MAX_AGE_MS });


    return res.status(200).json({
      success: true,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  };
};




// POST /api/auth/createuser
const refreshToken = async (req: Request, res: Response) => {
  // const { email, password } = req.body;
  // console.log(email, password)


  // Placeholder response
  res.json({message: "From refreshToken"});
};


// POST /api/auth/createuser
const logoutUser = async (req: Request, res: Response) => {
  // const { email, password } = req.body;
  // console.log(email, password)


  // Placeholder response
  res.json({message: "From logoutUser"});
};




export {
  createUser,
  checkSessionStatus,
  loginUser,
  refreshToken,
  logoutUser
};