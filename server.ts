import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import cors from "cors";
import authRouter from "./routes/authRoute";
import newsletterRouter from "./routes/newsletterRoute";
import subscribeRouter from "./routes/subscribeRoute";
import { initDb } from "./dbClient";
import { isProduction } from "./utils/constants";
import { corsOptions } from "./utils/configObjs";

const app = express();

// const AWS_BUCKET_BASE_PATH = process.env.AWS_BUCKET_BASE_PATH; 
const environment = isProduction ? "production" : "development";

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(helmet());


// routes
app.use("/api/auth", authRouter);

// *** for adding subscriber, confirming and unsubscribing
app.use("/api/subscribe", subscribeRouter);

// *** for getting, editing, deleting welcome email
// app.use("/api/welcome", welcomeRouter);

// *** for getting, adding, editing, deleting newsletter entries
app.use("/api/newsletter", newsletterRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 in ${environment} environment`);

  // initialize db on every save in development
  !isProduction && initDb();
});