import express from "express";
import { 
  subscribeNewsletter,
  confirmNewsletterSubscribe,
  unsubscribeNewsletter
} from "../controllers/newsletterController";


const newsletterRouter = express.Router();

// POST /api/newsletter/subscribe
newsletterRouter.route('/subscribe')
  .post(subscribeNewsletter);


// POST /api/newsletter/confirmsubscribe
newsletterRouter.route("/confirmsubscribe")
  .post(confirmNewsletterSubscribe);


// POST /api/auth/loginuser
newsletterRouter.route("/loginuser")
  .post(unsubscribeNewsletter);

  
export default newsletterRouter;