import express from "express";
import { 
  getWelcomeEmail,
  editWelcomeEmail,
} from "../controllers/welcomeController";


const welcomeRouter = express.Router();


// GET /api/welcome
welcomeRouter.route('/')
  .get(getWelcomeEmail);


// PUT /api/welcome/edit
welcomeRouter.route('/')
  .put(editWelcomeEmail);

  
export default welcomeRouter;