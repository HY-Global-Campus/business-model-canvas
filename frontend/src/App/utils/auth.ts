
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('email');
};

export const isValidJWT = (token: string | undefined | null): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  // JWT has 3 parts separated by dots: header.payload.signature
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

export const setAuthToken = (token: string | undefined, displayName: string | undefined, id: string | undefined, email: string | undefined): boolean => {
  if (!token || !displayName || !id || !email) {
    console.error('Missing required authentication data:', { 
      hasToken: !!token, 
      hasDisplayName: !!displayName, 
      hasId: !!id, 
      hasEmail: !!email 
    });
    return false;
  }
  
  if (!isValidJWT(token)) {
    console.error('Invalid JWT token format:', token);
    return false;
  }
  
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('displayName', displayName);
  sessionStorage.setItem('id', id);
  sessionStorage.setItem('email', email);
  return true;
};
