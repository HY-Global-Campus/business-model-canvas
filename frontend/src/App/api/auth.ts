import api from './axiosInstance';

interface LoginResponse {
  token: string;
  displayName: string;
  id: string;
  email: string;
}

export const exchangeMoocCode = async (code: string, state: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login/mooc/exchange', { code, state });
  return response.data;
};

// Forgot Password API functions
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
}

export const requestPasswordReset = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>('/login/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>('/login/reset-password', { token, newPassword });
  return response.data;
};

export const validateResetToken = async (token: string): Promise<ValidateTokenResponse> => {
  const response = await api.get<ValidateTokenResponse>(`/login/validate-reset-token?token=${token}`);
  return response.data;
};
