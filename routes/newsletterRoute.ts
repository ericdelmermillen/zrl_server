import express from "express";
import { 
  getNewsletters,
  getNewsletterByID,
  addNewsletter,
  editNewsletterByID,
  deleteNewsletterByID
} from "../controllers/newsletterController";


const newsletterRouter = express.Router();


// GET /api/newsletter/newsletters
newsletterRouter.route('/newsletters')
  .get(getNewsletters);


// GET /api/newsletter/newsletter:id
newsletterRouter.route('/newsletters/:id')
  .get(getNewsletterByID);


// POST /api/newsletter/add
newsletterRouter.route('/add')
  .post(addNewsletter);


// PUT /api/newsletter/edit:id
newsletterRouter.route("/edit/:id")
  .put(editNewsletterByID);


// DELETE /api/newsletter/unsubscribe
newsletterRouter.route("/delete/:id")
  .delete(deleteNewsletterByID);

  
export default newsletterRouter;