import express from "express";
import { 
  addSubscriber,
  confirmSubscriber,
  unsubscribe
} from "../controllers/subscribeController";


const subscribeRouter = express.Router();

// POST /api/subscribe/addsubscriber
subscribeRouter.route('/addsubscriber')
  .post(addSubscriber);


// POST /api/subscribe/confirmsubscriber
// *** is this POST? what is being posted?
subscribeRouter.route("/confirmsubscriber")
  .post(confirmSubscriber);


// POST /api/subscribe/unsubscribe
subscribeRouter.route("/unsubscribe")
  .post(unsubscribe);

  
export default subscribeRouter;