import express from "express";
import { 
  validateRequest, 
  nameIsValid, 
  emailIsValid, 
  greetingIsValid, 
  subjectIsValid,
  bodyContentIsValid
} from "../middleware/validationSchemas";
import { 
  getMoreInfoEmail,
  editMoreInfoEmail,
  sendMoreInfoEmail,
  sendMoreInfoTestEmail
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
    validateRequest(subjectIsValid),
    validateRequest(greetingIsValid),
    validateRequest(bodyContentIsValid),
    editMoreInfoEmail);

// POST /api/moreinfo/send
moreInfoRouter.route('/send')
  .post(
    validateRequest(nameIsValid),
    validateRequest(emailIsValid),
    sendMoreInfoEmail);

// POST /api/moreinfo/sendtest
moreInfoRouter.route('/sendtest')
  .post(
    // authenticate,
    validateRequest(nameIsValid),
    validateRequest(emailIsValid),
    validateRequest(subjectIsValid),
    validateRequest(greetingIsValid),
    validateRequest(bodyContentIsValid),
    sendMoreInfoTestEmail);
  
export default moreInfoRouter;