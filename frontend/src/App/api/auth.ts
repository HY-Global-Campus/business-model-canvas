import api from './axiosInstance';

interface LoginResponse {
  token: string;
  displayName: string;
  id: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { username, password });
  return response.data;
};

