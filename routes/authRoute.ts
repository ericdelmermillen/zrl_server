import express from "express";
import { validateRequest, emailIsValid, passwordIsValid } from "../middleware/validationSchemas";
import { 
  createUser, 
  loginUser, 
  checkSessionStatus,
  logoutUser
} from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";


const authRouter = express.Router();


// POST /api/auth/createuser
authRouter.route('/createuser')
  .post(
    validateRequest(emailIsValid),
    validateRequest(passwordIsValid),
    createUser);


// POST /api/auth/sessionstatus
authRouter.route("/sessionstatus")
  .post(checkSessionStatus);


// POST /api/auth/loginuser
authRouter.route("/loginuser")
  .post(
    validateRequest(emailIsValid),
    validateRequest(passwordIsValid),
    loginUser);


// POST /api/auth/logoutUser
authRouter.route("/logoutuser")
  .post(authenticate, logoutUser);

  
export default authRouter;