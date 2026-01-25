import { Request, Response } from "express";
// import { decodeJWT,getFreshTokens } from "../utils/utils.mjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
import pool from "../dbClient";

dotenv.config();


// sample cookie options object; not secure, for illustration purposes only
const cookieOptions = {
  httpOnly: false,
  secure: false,
  sameSite: "lax" as const,
  path: "/",
};


// POST /api/auth/createuser
const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid email or password" });
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
      message: "User created successfully",
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(409).json({
        message: "A user with that email already exists",
      });
    };
    console.error("Create user failed:", error);
    return res.status(500).json({ error: "Create user failed" });
  };
};




// POST /api/auth/createuser
const loginUser = async (req: Request, res: Response) => {
  // these will come in in the cookie
  // const { email, password } = req.body;
  // console.log(email, password)


//   // res.cookie("testKeyUno", "testValueUno", cookieOptions);
//   // res.cookie("testKeyDos", "testValueDos", cookieOptions);
//   // res.cookie("testKeyTres", "testValueTres", cookieOptions);


  // Placeholder response
  res.json({message: "From loginUser"});
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