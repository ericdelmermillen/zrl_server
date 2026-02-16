import express from "express";
import { 
  getNewsletters,
  getNewsletterByID,
  addNewsletter,
  editNewsletter,
  deleteNewsletter
} from "../controllers/newsletterController";


const newsletterRouter = express.Router();


// GET /api/newsletter/newsletters
newsletterRouter.route('/newsletters')
  .post(getNewsletters);


// GET /api/newsletter/newsletter:id
newsletterRouter.route('/newsletters:id')
  .post(getNewsletterByID);


// POST /api/newsletter/add
newsletterRouter.route('/add')
  .post(addNewsletter);


// PUT /api/newsletter/edit:id
newsletterRouter.route("/edit:id")
  .post(editNewsletter);


// DELETE /api/newsletter/unsubscribe
newsletterRouter.route("/delete:id")
  .post(deleteNewsletter);

  
export default newsletterRouter;