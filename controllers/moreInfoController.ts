import { Request, Response } from "express";
import { Resend } from "resend";
// import { getToken, clearAuthCookies,setAuthCookies } from "../utils/utilFunctions";
// import { TOKEN_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_MAX_AGE_MS} from "../utils/constants";
// import { cookieOptions } from "../utils/configObjs";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { buildMoreInfoEmailTemplate } from "../templates/moreInfoEmailTemplate";
import { COPYRIGHT } from "../utils/constants";
import { TEXT_COLOR, SPACING_SMALL, FONT_SIZE_BODY } from "../styling/stylingConstants"
import { linkifyForEmail } from "../utils/utilFunctions";
import { resend } from "../utils/resendClient";
import pool from "../dbClient";

// const JWT_SECRET = process.env.JWT_SECRET!;
const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS!
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS!
const COMPANY_NAME = process.env.COMPANY_NAME!


// need word mark for top bar (larger), word make for footer, logo

// GET /api/moreinfo
const getMoreInfoEmail = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT subject, greeting, body_content
      FROM more_info_email
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "More info email not found."
      });
    };

    const { subject, greeting, body_content } = result.rows[0];

    return res.status(200).json({
      success: true,
      subject: subject,
      greeting: greeting,
      body_content: body_content,
      companyName: COMPANY_NAME,
      copyRight: COPYRIGHT
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching more info email.",
      error
    });
  };
};

// PUT /api/moreinfo/edit
const editMoreInfoEmail = async (req: Request, res: Response) => {
  const { subject, greeting, body_content } = req.body;

  try {
    const result = await pool.query(`
      UPDATE more_info_email
      SET
        subject = $1,
        greeting = $2,
        body_content = $3,
        modified_at = NOW()
      WHERE id = TRUE
      RETURNING subject, greeting, body_content, modified_at
    `, [subject, greeting, body_content]);

    if(result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "More info email not found."
      });
    };

    return res.status(200).json({
      success: true,
      message: "More info email updated successfully.",
      ...result.rows[0],
      companyName: COMPANY_NAME,
      copyRight: COPYRIGHT
    });

  } catch(error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating more info email.",
      error
    });
  };
};


// POST /api/moreinfo/send
// rewrite to store footer separately and add it dynamically so I can send it in the getMoreInfoEmail response
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

    const personalizedGreeting = greeting.replace("<name>", name.split(" ")[0]);


    const paragraphsHtml = body_content
      .split("\n")
      .filter((p: string) => p.trim() !== "")
      .map((p: string, i: number, arr: string[]) => `
        <p style="
          margin: 0 0 ${i < arr.length - 1 ? SPACING_SMALL : "40px"} 0;
          color: ${TEXT_COLOR};
          font-size: ${FONT_SIZE_BODY};
          line-height: 1.7;
        ">${linkifyForEmail(p)}</p>
      `)
      .join("");

    const html = buildMoreInfoEmailTemplate(personalizedGreeting, paragraphsHtml);

    const text = body_content
      .split("\n")
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
      hasSubscribed: hasSubscribed
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while sending email",
      error: error
    });
  };
};

export {
  getMoreInfoEmail,
  editMoreInfoEmail,
  sendMoreInfoEmail
};