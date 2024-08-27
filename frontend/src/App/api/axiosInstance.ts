
import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';
import { logout } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Set your API base URL here
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

export default api;
