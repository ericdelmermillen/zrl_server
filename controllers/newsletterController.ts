import { Request, Response } from "express";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;


// POST /api/newsletter/subscribe
const subscribeNewsletter = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Placeholder subscribe response"
    });
};


// POST /api/newsletter/confirmsubscribe
const confirmNewsletterSubscribe = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Placeholder confirm subscribe response"
    });
};

// POST /api/newsletter/unsubscribe
const unsubscribeNewsletter = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Placeholder confirm unsubscribe response"
    });
};



export {
  subscribeNewsletter,
  confirmNewsletterSubscribe,
  unsubscribeNewsletter
};