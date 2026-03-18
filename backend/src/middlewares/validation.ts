import { body, validationResult, ValidationChain } from 'express-validator';
import { sendErrorResponse } from '../utilities/errorHandler.js';
import { Request, Response, NextFunction } from 'express';

/**
 * Validate request and send standardized error response if validation fails
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // Send standardized error response
    sendErrorResponse(res, 'VALIDATION_ERROR', {
      errors: errors.array()
    });
  };
};

/**
 * Predefined validation rules for common scenarios
 */
export const ValidationRules = {
  // Login validation
  login: [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  
  // Registration validation
  register: [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('displayName').isLength({ min: 2 }).withMessage('Display name must be at least 2 characters')
  ],
  
  // Email validation only
  email: [
    body('email').isEmail().withMessage('Please enter a valid email address')
  ],
  
  // Password validation with strength requirements
  strongPassword: [
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]
};

/**
 * Custom validation for existing email check
 */
export const checkEmailNotExists = (UserModel: any) => {
  return body('email').custom(async (email) => {
    const existingUser = await UserModel.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      throw new Error('This email is already registered');
    }
    return true;
  });
};