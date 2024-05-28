
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('displayName');
  localStorage.removeItem('id');
};
