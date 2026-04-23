export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  cin: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  user_type: 'beginner' | 'trader' | 'regulator';
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  initial_capital: number;
  investment_experience: 'none' | 'low' | 'medium' | 'high';
  investment_objective: 'growth' | 'income' | 'preservation';
  investment_horizon: 'short' | 'medium' | 'long';
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  cin: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  user_type: 'beginner' | 'trader' | 'regulator';
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  initial_capital: number;
  investment_experience: 'none' | 'low' | 'medium' | 'high';
  investment_objective: 'growth' | 'income' | 'preservation';
  investment_horizon: 'short' | 'medium' | 'long';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}