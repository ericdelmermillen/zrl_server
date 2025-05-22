// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import { generateUploadURL } from "../s3.mjs";
// import { decodeJWT,getFreshTokens } from "../utils/utils.mjs";
// import pool from '../dbClient.mjs';
import { Request, Response } from 'express';
import dotenv from "dotenv";

dotenv.config();

// POST /api/auth/createuser
const createUser = async (req: Request, res: Response) => {
  // const { email, password } = req.body;
  // console.log(email, password)

  // Placeholder response
  res.json({message: "It's yo' boy Air-to-the-Ik-in-the-his-house!"});
};

export {
  createUser
};