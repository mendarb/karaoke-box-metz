export interface AuthResponse {
  success: boolean;
  shouldSwitchToLogin: boolean;
}

export interface AuthHandlers {
  handleLogin: (email: string, password: string) => Promise<AuthResponse>;
  handleSignup: (email: string, password: string, fullName: string, phone: string) => Promise<AuthResponse>;
  handleResetPassword: (email: string) => Promise<AuthResponse>;
  isLoading: boolean;
}