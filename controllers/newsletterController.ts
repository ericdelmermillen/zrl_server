import { Request, Response } from "express";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;


// GET /api/newsletter/get
const getNewsletters = async (req: Request, res: Response) => {
   return res.status(200).json({
      success: true,
      message: "Placeholder get newsletters response"
    });
};


// GET /api/newsletter/get
const getNewsletterByID = async (req: Request, res: Response) => {
  const newsletterID = req.params.id;

   return res.status(200).json({
      success: true,
      message: `Placeholder get newsletter ${newsletterID} response`
    });
};


// POST /api/newsletter/add
const addNewsletter = async (req: Request, res: Response) => {
   return res.status(200).json({
      success: true,
      message: "Placeholder add newsletter response"
    });
};


// PUT /api/newsletter/add
const editNewsletterByID = async (req: Request, res: Response) => {
  const newsletterID = req.params.id;
  
   return res.status(200).json({
      success: true,
      message: `Placeholder edit newsletter ${newsletterID} response`
    });
};


// PUT /api/newsletter/delete
const deleteNewsletterByID = async (req: Request, res: Response) => {
  const newsletterID = req.params.id;

   return res.status(200).json({
      success: true,
      message: `Placeholder delete newsletter ${newsletterID} response`
    });
};


export {
  getNewsletters,
  getNewsletterByID,
  addNewsletter,
  editNewsletterByID,
  deleteNewsletterByID
};