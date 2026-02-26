import { Request, Response } from "express";
import { Resend } from "resend";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import pool from "../dbClient";
import { buildWelcomeEmailTemplate } from "../templates/welcomeEmailTemplate";
import {  TEXT_COLOR, SPACING_SMALL, FONT_SIZE_BODY,
} from "../styling/stylingConstants"

// const JWT_SECRET = process.env.JWT_SECRET!;
const resend = new Resend(process.env.RESEND_EMAILING_API_KEY);
const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS!
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS!
// console.log(ADMIN_EMAIL_ADDRESS)

// need word mark for top bar (larger), word make for footer, logo


// GET /api/welcome
const getWelcomeEmails = async (req: Request, res: Response) => {
   return res.status(200).json({
      success: true,
      message: "Placeholder get welcome email response"
    });
};


// POST /api/welcome/
const createNewWelcomeEmail = async (req: Request, res: Response) => {
  
   return res.status(200).json({
      success: true,
      message: "Placeholder new welcome email response"
    });
};


// POST /api/welcome/send
const sendWelcomeEmail = async (req: Request, res: Response) => {
  const { name, email, phone, timezone, hasSubscribed = false } = req.body;

  try {
    const result = await pool.query(`
      SELECT subject, body_content
      FROM welcome_email_versions
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Unable to send More Info email."
      });
    };

    const { subject, body_content } = result.rows[0];

    const paragraphsHtml = body_content
      .split("\\n")
      .filter((p: string) => p.trim() !== "")
      .map((p: string, i: number, arr: string[]) => `
        <p style="
          margin: 0 0 ${i < arr.length - 1 ? SPACING_SMALL : "40px"} 0;
          color: ${TEXT_COLOR};
          font-size: ${FONT_SIZE_BODY};
          line-height: 1.7;
        ">${p}</p>
      `)
      .join("");

    const html = buildWelcomeEmailTemplate(name, paragraphsHtml);

    const text = body_content
      .split("\\n")
      .filter((p: string) => p.trim() !== "")
      .join("\n\n");

    const dateOfContact = new Date().toLocaleString("en-CA", {
      timeZone: timezone ?? "UTC",
      dateStyle: "full",
      timeStyle: "long"
    });

    const notificationHtml = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>`: ""}
      <p><strong>Timezone:</strong> ${timezone ?? "UTC"}</p>
      <p><strong>Date of inquiry:</strong> ${dateOfContact}</p>
    `;

    const notificationText = [
      "New Information Request",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Timezone: ${timezone ?? "UTC"}`,
      `Date of Contact: ${dateOfContact}`,
      `Subscribed to newsletter: ${hasSubscribed ? "Yes" : "No"}`
      ]
      .filter((item) => !!item)
      .join("\n");

    const [ welcomeResult, notificationResult ] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL_ADDRESS,
        to: email,
        subject: subject,
        html: html,
        text: text
      }),
      resend.emails.send({
        from: FROM_EMAIL_ADDRESS,
        to: ADMIN_EMAIL_ADDRESS,
        subject: `New Contact Request from ${name}`,
        html: notificationHtml,
        text: notificationText
      })
    ]);

    if (welcomeResult.error || notificationResult.error) {
      return res.status(400).json({
        success: false,
        message: "Failed to send email",
        error: welcomeResult.error || notificationResult.error
      });
    };

    // TODO: upsert subscriber into newsletter_subscribers table
    if (hasSubscribed) {
      console.log("user has subscribed")
      // await pool.query(`
      //   INSERT INTO newsletter_subscribers (email, name)
      //   VALUES ($1, $2)
      //   ON CONFLICT (email) DO NOTHING
      // `, [email, name]);
    };

    return res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while sending email",
      error
    });
  };
};


export {
  getWelcomeEmails,
  createNewWelcomeEmail,
  sendWelcomeEmail
};