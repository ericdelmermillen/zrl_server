import express from "express";
import { createUser } from "../controllers/authController";

const authRouter = express.Router();

// POST /api/auth/createuser
authRouter.route('/createuser')
  .post(createUser);


  export default authRouter;