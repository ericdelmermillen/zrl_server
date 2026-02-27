import { Request, Response } from "express";
import { Resend } from "resend";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { buildMoreInfoEmailTemplate } from "../templates/moreInfoEmailTemplate";
import {  TEXT_COLOR, SPACING_SMALL, FONT_SIZE_BODY } from "../styling/stylingConstants"
import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;
const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS!
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS!

const resend = new Resend(process.env.RESEND_EMAILING_API_KEY);


// need word mark for top bar (larger), word make for footer, logo

// GET /api/moreinfo
const getMoreInfoEmails = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Placeholder get moreInfo email response"
  });
};


// POST /api/moreinfo/
const createNewMoreInfoEmail = async (req: Request, res: Response) => {  
  return res.status(200).json({
    success: true,
    message: "Placeholder new moreInfo email response"
  });
};


// POST /api/moreinfo/send
const sendMoreInfoEmail = async (req: Request, res: Response) => {
  const { name, email, phone, timezone = "UTC", hasSubscribed = false } = req.body;

  try {
    const result = await pool.query(`
      SELECT subject, greeting, body_content
      FROM more_info_email
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Unable to send moreInfo email."
      });
    };

    const { subject, greeting, body_content } = result.rows[0];

    const personalizedGreeting = greeting.replace("<name>", name);

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

    const html = buildMoreInfoEmailTemplate(personalizedGreeting, paragraphsHtml);

    const text = body_content
      .split("\\n")
      .filter((p: string) => p.trim() !== "")
      .join("\n\n");

    const safeTimezone = (() => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        return timezone;
      } catch {
        return "UTC";
      };
    })();

    const dateOfContact = new Date().toLocaleString("en-CA", {
      timeZone: safeTimezone,
      dateStyle: "full",
      timeStyle: "long"
    });

    const notificationHtml = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>`: ""}
      ${safeTimezone !== "UTC" ? `<p><strong>Timezone:</strong> ${safeTimezone}</p>`: ""}
      <p><strong>Date of inquiry:</strong> ${dateOfContact}</p>
    `;

    const notificationText = [
      "New Information Request",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      safeTimezone !== "UTC" ? `Timezone: ${safeTimezone}` : null,
      `Date of Contact: ${dateOfContact}`,
      `Subscribed to newsletter: ${hasSubscribed ? "Yes" : "No"}`
      ]
      .filter((item) => !!item)
      .join("\n");

    const [ moreInfoResult, notificationResult ] = await Promise.all([
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

    if (moreInfoResult.error || notificationResult.error) {
      return res.status(400).json({
        success: false,
        message: "Failed to send email",
        error: moreInfoResult.error || notificationResult.error
      });
    };

    // TODO: upsert subscriber into newsletter_subscribers table
    if (hasSubscribed) {
      console.log(`${name} has subscribed`)
      // await pool.query(`
      //   INSERT INTO newsletter_subscribers (email, name)
      //   VALUES ($1, $2)
      //   ON CONFLICT (email) DO NOTHING
      // `, [email, name]);
    };

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      hasSubscribed
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
  getMoreInfoEmails,
  createNewMoreInfoEmail,
  sendMoreInfoEmail
};