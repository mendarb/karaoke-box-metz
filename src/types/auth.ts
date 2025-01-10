import { User, Session } from "@supabase/supabase-js";

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  phoneCountryCode: string;
}

export interface AuthResponse {
  success: boolean;
  shouldSwitchToLogin: boolean;
  message?: string;
}

export interface SignupResult {
  success: boolean;
  message: string;
  shouldSwitchToLogin?: boolean;
  data?: {
    user: User | null;
    session: Session | null;
  };
}

export interface AuthHandlers {
  handleLogin: (email: string, password: string) => Promise<AuthResponse>;
  handleSignup: (email: string, password: string, fullName: string, phone: string, phoneCountryCode: string) => Promise<SignupResult>;
  handleResetPassword: (email: string) => Promise<AuthResponse>;
  isLoading: boolean;
}