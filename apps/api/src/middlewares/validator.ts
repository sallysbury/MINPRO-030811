import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export class Validator {
  validateRegister = [
    body('name').notEmpty().withMessage('User Name Required'),
    body('email')
      .notEmpty()
      .withMessage('Email Required')
      .isEmail()
      .withMessage('Invalid Email'),
    body('password').notEmpty().withMessage('Password Required'),
    (req: Request, res: Response, next: NextFunction) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).send({ err: error.array() });
      }
      next();
    },
  ];
  validateLogin = [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid Email'),
    body('password').notEmpty().withMessage('Password is required'),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      next()
    },
  ];
}
