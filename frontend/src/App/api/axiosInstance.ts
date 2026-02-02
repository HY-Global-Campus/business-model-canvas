
import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';
import { logout } from '../utils/auth';

// User-friendly error messages for common error codes
const ERROR_MESSAGES = {
  'AUTH_001': 'Invalid email or password. Please check your credentials and try again.',
  'AUTH_002': 'This account uses OAuth login. Please use the OAuth provider to sign in.',
  'AUTH_003': 'You are not authorized to access this resource.',
  'AUTH_004': 'You do not have permission to perform this action.',
  'VAL_001': 'Please enter a valid email address.',
  'VAL_002': 'Password must be at least 6 characters long.',
  'VAL_003': 'Display name must be at least 2 characters long.',
  'VAL_004': 'Please fill in all required fields.',
  'RES_001': 'This email is already registered. Please use a different email or try logging in.',
  'RES_002': 'The requested resource was not found.',
  'SYS_001': 'An unexpected error occurred. Please try again later.',
  'SYS_002': 'The service is temporarily unavailable. Please try again later.',
};

// Log the API URL for debugging
const apiUrl = import.meta.env.VITE_API_URL;
console.log('[axios] VITE_API_URL:', apiUrl);

if (!apiUrl) {
  console.error('[axios] VITE_API_URL is not set! API requests will fail.');
}

const api = axios.create({
  baseURL: apiUrl, // Set your API base URL here
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    logout();
    window.location.href = '/login';
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response;
      
      // Handle standardized error responses from our backend
      if (data && data.error && data.code) {
        // Use the user-friendly message from our ERROR_MESSAGES map
        const errorCode = data.code as keyof typeof ERROR_MESSAGES;
        const userFriendlyMessage = ERROR_MESSAGES[errorCode] || data.error;
        
        // Create a new error with the user-friendly message
        const userFriendlyError = new Error(userFriendlyMessage);
        userFriendlyError.name = 'ApiError';
        
        // Preserve the original error details for debugging
        if (userFriendlyError instanceof Error) {
          (userFriendlyError as any).originalError = error;
          (userFriendlyError as any).status = status;
          (userFriendlyError as any).errorCode = data.code;
        }
        
        return Promise.reject(userFriendlyError);
      }
      
      // Handle non-standardized errors
      let message = 'An unexpected error occurred';
      
      if (status === 401) {
        message = 'You are not authorized to access this resource.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status === 500) {
        message = 'An internal server error occurred. Please try again later.';
      } else if (data && data.error) {
        message = data.error;
      } else if (data && data.message) {
        message = data.message;
      }
      
      const errorWithMessage = new Error(message);
      if (errorWithMessage instanceof Error) {
        (errorWithMessage as any).originalError = error;
        (errorWithMessage as any).status = status;
      }
      
      return Promise.reject(errorWithMessage);
    } else if (error.request) {
      // The request was made but no response was received
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      if (networkError instanceof Error) {
        (networkError as any).originalError = error;
        (networkError as any).isNetworkError = true;
      }
      return Promise.reject(networkError);
    } else {
      // Something happened in setting up the request that triggered an Error
      const setupError = new Error('Request setup error. Please try again.');
      if (setupError instanceof Error) {
        (setupError as any).originalError = error;
        (setupError as any).isSetupError = true;
      }
      return Promise.reject(setupError);
    }
  }
);

export default api;
