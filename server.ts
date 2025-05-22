import dotenv from "dotenv";
dotenv.config();

import express from 'express';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();

// const AWS_BUCKET_BASE_PATH = process.env.AWS_BUCKET_BASE_PATH; 
const CLIENT_HOST = process.env.CLIENT_HOST
const environment = process.env.NODE_ENV || "development";
const isProduction = environment === "production";

const corsOptions = { origin: CLIENT_HOST };
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());


import authRouter from "./routes/authRoute";

app.use('/api/auth', authRouter);



// Routers
// authRouter for createUser, login, logout, AWS signed url
app.use('/api/auth', authRouter);



if(isProduction)  {
  console.log("In production mode");
};

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 in ${environment} environment`);
});