
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('email');
};

export const isValidJWT = (token: string): boolean => {
  // JWT has 3 parts separated by dots: header.payload.signature
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

export const setAuthToken = (token: string, displayName: string, id: string, email: string): boolean => {
  if (!isValidJWT(token)) {
    console.error('Invalid JWT token format');
    return false;
  }
  
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('displayName', displayName);
  sessionStorage.setItem('id', id);
  sessionStorage.setItem('email', email);
  return true;
};
