const CLIENT_HOST = process.env.CLIENT_HOST;
import { isProduction } from "./constants";

const corsOptions = { 
  origin: CLIENT_HOST, 
  credentials: true 
};

const cookieOptions = {
  httpOnly: true,                // should be true in both envs
  secure: isProduction,          // HTTPS only in prod
  sameSite: isProduction ? "none" : "lax",
  path: "/",
} as const;

export {
  corsOptions,
  cookieOptions
};