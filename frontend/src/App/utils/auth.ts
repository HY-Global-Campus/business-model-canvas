
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('id');
};
