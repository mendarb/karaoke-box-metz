export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface SignupResult {
  success: boolean;
  message: string;
  data?: any;
  shouldSwitchToLogin?: boolean;
}