
import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';
import { logout } from '../utils/auth';

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

export default api;
