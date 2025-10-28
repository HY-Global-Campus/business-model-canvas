import api from './axiosInstance';

interface LoginResponse {
  token: string;
  displayName: string;
  id: string;
  email: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { email, password });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login/register', { 
    email, 
    password, 
    displayName 
  });
  return response.data;
};

// Placeholder for future OAuth implementation
export const loginWithOAuth = async (provider: string): Promise<LoginResponse> => {
  // TODO: Implement OAuth flow
  // 1. Redirect to OAuth provider
  // 2. Handle callback
  // 3. Exchange code for token
  throw new Error(`OAuth with ${provider} not yet implemented`);
};
