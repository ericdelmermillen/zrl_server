import { convertJWTExpirationToMs } from "./utilFunctions";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXP_INT = process.env.JWT_TOKEN_EXPIRATION_INTERVAL;
const REFRESH_TOKEN_EXP_INT = process.env.JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL;

// env var checks centralized here
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
};

if (!TOKEN_EXP_INT) {
  throw new Error("JWT_TOKEN_EXPIRATION_INTERVAL is not defined")
};

if (!REFRESH_TOKEN_EXP_INT) {
  throw new Error("JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL is not defined")
};

const isProduction = process.env.NODE_ENV === "production";

const TOKEN_COOKIE_MAX_AGE_MS = convertJWTExpirationToMs(TOKEN_EXP_INT);

const REFRESH_COOKIE_MAX_AGE_MS = convertJWTExpirationToMs(REFRESH_TOKEN_EXP_INT);


export {
  isProduction,
  TOKEN_COOKIE_MAX_AGE_MS,
  REFRESH_COOKIE_MAX_AGE_MS
};