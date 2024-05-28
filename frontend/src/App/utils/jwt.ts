import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

export const getTokenExpiration = (token: string): number => {
  const decoded = jwtDecode<TokenPayload>(token);
  return decoded.exp * 1000; // Convert to milliseconds
};

export const isTokenExpired = (token: string): boolean => {
  const expirationTime = getTokenExpiration(token);
  return Date.now() > expirationTime;
};
