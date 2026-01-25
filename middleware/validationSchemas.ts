import { 
  body, 
  // param,
  validationResult, 
  ValidationChain
 } from "express-validator";
import { Request, Response, NextFunction } from "express";


const validateRequest =
  (validations: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {

    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsgs = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMsgs });
    };

    next();
  };


// for createUser and loginUser routes
const emailAndPasswordAreValid = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email format'),

  body("password")
    .trim()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8-32 characters long"),
];


export {
  validateRequest,
  emailAndPasswordAreValid
}