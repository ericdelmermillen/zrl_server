import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import cors from "cors";
import authRouter from "./routes/authRoute";
import { initDb } from "./dbClient";

const app = express();

// const AWS_BUCKET_BASE_PATH = process.env.AWS_BUCKET_BASE_PATH; 
const CLIENT_HOST = process.env.CLIENT_HOST
const environment = process.env.NODE_ENV || "development";

const corsOptions = { 
  origin: CLIENT_HOST, 
  credentials: true 
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(helmet());


// routes
app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 in ${environment} environment`);

  // initialize db on every save in development
  environment === "development" && initDb();
});