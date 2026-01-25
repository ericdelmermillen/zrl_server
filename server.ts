// IMPORTANT (ESM + tsx):
// We must use `import "dotenv/config"` instead of calling `dotenv.config()`
// in runtime code. In ESM, all static imports (including dbClient) are
// executed BEFORE any top-level code in this file runs. Using the side-effect
// import ensures environment variables are loaded during module initialization,
// so `process.env.*` is defined when dbClient is imported.
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import cors from "cors";
import { initDb } from "./dbClient";

const app = express();

// const AWS_BUCKET_BASE_PATH = process.env.AWS_BUCKET_BASE_PATH; 
const CLIENT_HOST = process.env.CLIENT_HOST
const environment = process.env.NODE_ENV || "development";
const isProduction = environment === "production";

const corsOptions = { origin: CLIENT_HOST };
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(helmet());


// routes
import authRouter from "./routes/authRoute";


app.use("/api/auth", authRouter);


// Routers
// authRouter for createUser, login, logout, AWS signed url
app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 in ${environment} environment`);

  // initialize db on every save in development
  environment === "development" && initDb()
});