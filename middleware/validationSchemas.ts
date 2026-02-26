import { Request, Response, NextFunction } from "express";
import { 
  body, 
  // param,
  validationResult, 
  ValidationChain
 } from "express-validator";


const validateRequest =
  (validations: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {

    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsgs = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMsgs });
    };

    next();
  };


const nameIsValid = [
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
];


const emailIsValid = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email format')
];


const passwordIsValid = [
  body("password")
    .trim()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8-32 characters long")
];


export {
  validateRequest,
  nameIsValid,
  emailIsValid,
  passwordIsValid
};