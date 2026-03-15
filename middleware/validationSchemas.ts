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

const subjectIsValid = [
  body('subject')
    .trim()
    .isString()
    .withMessage('Subject must be a string')
    .isLength({ min: 2, max: 255 })
    .withMessage('Subject must be between 2 and 255 characters')
];

const greetingIsValid = [
  body('greeting')
    .trim()
    .isString()
    .withMessage('Greeting must be a string')
    .isLength({ min: 2, max: 255 })
    .withMessage('Greeting must be between 2 and 255 characters')
    .contains('<name>')
    .withMessage('Greeting must contain \"<name>\"')
];

const bodyContentIsValid = [
  body('body_content')
    .trim()
    .isString()
    .withMessage('Body content must be a string')
    .isLength({ min: 25 })
    .withMessage('Body content must be at least 25 characters long')
];


export {
  validateRequest,
  nameIsValid,
  emailIsValid,
  passwordIsValid,
  subjectIsValid,
  greetingIsValid,
  bodyContentIsValid
};