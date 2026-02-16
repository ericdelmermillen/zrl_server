import express from "express";
import { 
  createUser, 
  loginUser, 
  checkSessionStatus,
  logoutUser
} from "../controllers/authController";
import { validateRequest,emailAndPasswordAreValid } from "../middleware/validationSchemas";

const authRouter = express.Router();


// POST /api/auth/createuser
authRouter.route('/createuser')
  .post(
    validateRequest(emailAndPasswordAreValid),
    createUser);


// POST /api/auth/sessionstatus
authRouter.route("/sessionstatus")
  .post(checkSessionStatus);


// POST /api/auth/loginuser
authRouter.route("/loginuser")
  .post(
    validateRequest(emailAndPasswordAreValid),
    loginUser);


// POST /api/auth/logoutUser
authRouter.route("/logoutuser")
  .post(logoutUser);

  
export default authRouter;