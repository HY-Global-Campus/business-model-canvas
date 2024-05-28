
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwt';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

