import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

export const getTokenExpiration = (token: string): number | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const expirationTime = getTokenExpiration(token);
    if (expirationTime === null) {
      return true; // Treat invalid tokens as expired
    }
    return Date.now() > expirationTime;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true; // Treat errors as expired
  }
};
