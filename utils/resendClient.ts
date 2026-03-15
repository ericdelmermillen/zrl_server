import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_EMAILING_API_KEY

const resend = new Resend(RESEND_API_KEY);

export { 
  resend
};