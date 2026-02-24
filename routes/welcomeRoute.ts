import express from "express";
import { 
  getWelcomeEmail,
  editWelcomeEmail,
  sendWelcomeEmail
} from "../controllers/welcomeController";


const welcomeRouter = express.Router();


// GET /api/welcome
welcomeRouter.route('/')
  .get(getWelcomeEmail);


// PUT /api/welcome/edit
welcomeRouter.route('/')
  .put(editWelcomeEmail);


// add express validator for email
// POST /api/welcome/send
welcomeRouter.route('/send')
  .post(sendWelcomeEmail);

  
export default welcomeRouter;