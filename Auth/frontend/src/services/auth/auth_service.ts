import type { AuthResponse, LoginCredentials, User } from "@/models/AuthModels";
import api from '../apiClients';

export const refresh_token = async (): Promise<void> => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error) { 
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/me');
  return response.data.user;
};

export const updateProfile = async (userData: FormData): Promise<User> => {
  const response = await api.post('/profile', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.user;
};

export const resendVerificationEmail = async (email: string) => {
  const response = await api.post('/auth/verify_resend', { email });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (email: string, token: string, password: string, password_confirmation: string) => {
  const response = await api.post('/auth/reset-password', {
    email,
    token,
    password,
    password_confirmation
  });
  return response.data;
};

export const verifyResetToken = async (token: string) => {
  const response = await api.post('/auth/verify-reset-token', { token });
  return response.data;
};