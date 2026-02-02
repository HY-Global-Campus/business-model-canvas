import { Response } from 'express';

/**
 * Standard error response format for consistent error handling
 */
interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

/**
 * Common error types with user-friendly messages
 */
export const ErrorTypes = {
  // Authentication errors
  INVALID_CREDENTIALS: {
    code: 'AUTH_001',
    message: 'Invalid email or password. Please check your credentials and try again.',
    status: 401
  },
  OAUTH_REQUIRED: {
    code: 'AUTH_002', 
    message: 'This account uses OAuth login. Please use the OAuth provider to sign in.',
    status: 401
  },
  UNAUTHORIZED: {
    code: 'AUTH_003',
    message: 'You are not authorized to access this resource.',
    status: 401
  },
  FORBIDDEN: {
    code: 'AUTH_004',
    message: 'You do not have permission to perform this action.',
    status: 403
  },
  
  // Validation errors
  INVALID_EMAIL_FORMAT: {
    code: 'VAL_001',
    message: 'Please enter a valid email address.',
    status: 400
  },
  PASSWORD_TOO_SHORT: {
    code: 'VAL_002',
    message: 'Password must be at least 6 characters long.',
    status: 400
  },
  DISPLAY_NAME_TOO_SHORT: {
    code: 'VAL_003',
    message: 'Display name must be at least 2 characters long.',
    status: 400
  },
  MISSING_REQUIRED_FIELDS: {
    code: 'VAL_004',
    message: 'Please fill in all required fields.',
    status: 400
  },
  
  // Resource errors
  EMAIL_ALREADY_REGISTERED: {
    code: 'RES_001',
    message: 'This email is already registered. Please use a different email or try logging in.',
    status: 409
  },
  RESOURCE_NOT_FOUND: {
    code: 'RES_002',
    message: 'The requested resource was not found.',
    status: 404
  },
  
  // Validation errors
  VALIDATION_ERROR: {
    code: 'VAL_005',
    message: 'Validation failed. Please check the errors and try again.',
    status: 400
  },
  PASSWORD_WEAK: {
    code: 'VAL_006',
    message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
    status: 400
  },
  
  // System errors
  INTERNAL_SERVER_ERROR: {
    code: 'SYS_001',
    message: 'An unexpected error occurred. Please try again later.',
    status: 500
  },
  SERVICE_UNAVAILABLE: {
    code: 'SYS_002',
    message: 'The service is temporarily unavailable. Please try again later.',
    status: 503
  }
};

/**
 * Send a standardized error response
 * @param res Express response object
 * @param errorType Error type from ErrorTypes
 * @param details Additional error details (optional)
 */
export function sendErrorResponse(res: Response, errorType: keyof typeof ErrorTypes, details?: any): void {
  const errorConfig = ErrorTypes[errorType];
  const response: ErrorResponse = {
    error: errorConfig.message,
    code: errorConfig.code
  };
  
  if (details) {
    response.details = details;
  }
  
  res.status(errorConfig.status).json(response);
}

/**
 * Handle unexpected errors with consistent formatting
 * @param error The error object
 * @param res Express response object
 * @param context Context for logging
 */
export function handleUnexpectedError(error: unknown, res: Response, context: string = 'Unknown'): void {
  console.error(`[${context}] Unexpected error:`, error);
  
  if (error instanceof Error) {
    sendErrorResponse(res, 'INTERNAL_SERVER_ERROR', {
      context,
      message: error.message
    });
  } else {
    sendErrorResponse(res, 'INTERNAL_SERVER_ERROR', {
      context,
      message: 'Unknown error occurred'
    });
  }
}

/**
 * Validate request and send error if validation fails
 * @param condition Validation condition
 * @param res Express response object  
 * @param errorType Error type to send if validation fails
 * @returns true if validation passes, false if error was sent
 */
export function validateRequest(condition: boolean, res: Response, errorType: keyof typeof ErrorTypes): boolean {
  if (!condition) {
    sendErrorResponse(res, errorType);
    return false;
  }
  return true;
}