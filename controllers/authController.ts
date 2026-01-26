// typing for req & res objs
import { Request, Response } from "express";
// import { decodeJWT,getFreshTokens } from "../utils/utils.mjs";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
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
    
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    };

    const payload = {
      userId: user.id,
      email: user.email
    };

    const signOptions: SignOptions = {
      expiresIn: "1h"
    };

    const token = jwt.sign(payload, jwtSecret, signOptions);

    res.cookie("token", token, cookieOptions);

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