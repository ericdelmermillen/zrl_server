// typing for req & res objs
import { Request, Response } from "express";
import { getToken } from "../utils/utils";
import bcrypt from "bcrypt";
import pool from "../dbClient";


const isProduction = process.env.NODE_ENV === "production";

// maxAge should be set separately for the token and refresh token
const cookieOptions = {
  httpOnly: true,                // should be true in both envs
  secure: isProduction,          // HTTPS only in prod
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  // add when you want persistence:
  // maxAge: 60 * 60 * 1000, // 1 hour
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

    const TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000; // 15m
    const REFRESH_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 1d

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
  loginUser,
  refreshToken,
  logoutUser
};