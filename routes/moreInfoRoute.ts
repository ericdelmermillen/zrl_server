import express from "express";
import { validateRequest, nameIsValid, emailIsValid } from "../middleware/validationSchemas";
import { 
  getMoreInfoEmails,
  createNewMoreInfoEmail,
  sendMoreInfoEmail
} from "../controllers/moreInfoController";


const moreInfoRouter = express.Router();


// GET /api/moreinfo
moreInfoRouter.route('/')
  .get(getMoreInfoEmails);


// POST /api/moreinfo/
moreInfoRouter.route('/')
  .post(createNewMoreInfoEmail);


// POST /api/moreinfo/send
moreInfoRouter.route('/send')
  .post(
    validateRequest(nameIsValid),
    validateRequest(emailIsValid),
    sendMoreInfoEmail);

  
export default moreInfoRouter;