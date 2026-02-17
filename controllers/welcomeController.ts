import { Request, Response } from "express";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;


// GET /api/welcome
const getWelcomeEmail = async (req: Request, res: Response) => {
   return res.status(200).json({
      success: true,
      message: "Placeholder get welcome email response"
    });
};


// PUT /api/welcome/
const editWelcomeEmail = async (req: Request, res: Response) => {
  
   return res.status(200).json({
      success: true,
      message: "Placeholder edit welcome email response"
    });
};


export {
  getWelcomeEmail,
  editWelcomeEmail
};