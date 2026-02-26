import express from "express";
import { validateRequest, nameIsValid, emailIsValid } from "../middleware/validationSchemas";
import { 
  getWelcomeEmails,
  createNewWelcomeEmail,
  sendWelcomeEmail
} from "../controllers/welcomeController";


const welcomeRouter = express.Router();


// GET /api/welcome
welcomeRouter.route('/')
  .get(getWelcomeEmails);


// POST /api/welcome/
welcomeRouter.route('/')
  .post(createNewWelcomeEmail);


// POST /api/welcome/send
welcomeRouter.route('/send')
  .post(
    validateRequest(nameIsValid),
    validateRequest(emailIsValid),
    sendWelcomeEmail);

  
export default welcomeRouter;