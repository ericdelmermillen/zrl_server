import { Request, Response } from "express";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;

// *** should be subscribe route and controller

// POST /api/subscribe/subscribe
const addSubscriber = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Placeholder add subscriber response"
    });
};


// POST /api/newsletter/confirmsubscriber
const confirmSubscriber = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Placeholder confirm subscriber response"
    });
};

// POST /api/newsletter/unsubscribe
const unsubscribe = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Placeholder unsubscribe response"
    });
};


export {
  addSubscriber,
  confirmSubscriber,
  unsubscribe
};