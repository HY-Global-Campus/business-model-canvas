import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body data
  if (req.body) {
    for (const key in req.body) {
      const value = req.body[key];
      if (typeof value === 'string') {
        req.body[key] = validator.escape(value);
      }
    }
  }
  
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      const value = req.query[key];
      if (typeof value === 'string') {
        req.query[key] = validator.escape(value);
      }
    }
  }
  
  // Sanitize params
  if (req.params) {
    for (const key in req.params) {
      const value = req.params[key];
      if (typeof value === 'string') {
        req.params[key] = validator.escape(value);
      }
    }
  }
  
  next();
};

/**
 * Check if password meets strength requirements
 */
export const checkPasswordStrength = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Enhanced password validation middleware
 */
export const validateStrongPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  
  if (!password) {
    return next(); // Let other validation handle missing password
  }
  
  if (!checkPasswordStrength(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      code: 'PASSWORD_WEAK'
    });
  }
  
  next();
};