export interface AuthResponse {
  success: boolean;
  shouldSwitchToLogin: boolean;
}

export interface AuthHandlers {
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleSignup: (email: string, password: string, fullName: string, phone: string) => Promise<AuthResponse>;
  handleResetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}