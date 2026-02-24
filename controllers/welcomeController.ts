import { Request, Response } from "express";
import { Resend } from "resend";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;
const resend = new Resend(process.env.RESEND_EMAILING_API_KEY);


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


// POST /api/welcome/
const sendWelcomeEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

       try {
      const { data, error } = await resend.emails.send({
         from: "info@zidgyroadlabs.com",
         to: email,
         subject: "Test Email from Zidgy Road Labs",
         html: "<p>This is a test email to verify Resend is working.</p>"
      });

      if (error) {
         return res.status(400).json({
            success: false,
            message: "Failed to send email",
            error: error
         });
      }

      return res.status(200).json({
         success: true,
         message: "Email sent successfully",
         data: data
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Server error while sending email",
         error: error
      });
   }

  
  //  return res.status(200).json({
  //     success: true,
  //     message: "Placeholder send welcome email response"
  //   });
};


export {
  getWelcomeEmail,
  editWelcomeEmail,
  sendWelcomeEmail
};