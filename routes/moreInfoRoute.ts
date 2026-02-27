import express from "express";
import { validateRequest, nameIsValid, emailIsValid } from "../middleware/validationSchemas";
import { 
  getMoreInfoEmail,
  editMoreInfoEmail,
  sendMoreInfoEmail
} from "../controllers/moreInfoController";
import { authenticate } from "../middleware/authenticate";


const moreInfoRouter = express.Router();


// GET /api/moreinfo
moreInfoRouter.route('/')
  .get(
    authenticate,
    getMoreInfoEmail);


// PUT /api/moreinfo/
moreInfoRouter.route('/edit')
  .put(
    authenticate,
    editMoreInfoEmail);


// POST /api/moreinfo/send
moreInfoRouter.route('/send')
  .post(
    validateRequest(nameIsValid),
    validateRequest(emailIsValid),
    sendMoreInfoEmail);

  
export default moreInfoRouter;