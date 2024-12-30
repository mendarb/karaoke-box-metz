import { AuthError } from "@supabase/supabase-js";
import { SignupErrorType, SIGNUP_ERROR_MESSAGES } from "@/types/auth/signupErrors";

export const getSignupErrorType = (error: AuthError): SignupErrorType => {
  if (error.message.includes("User already registered")) {
    return "USER_EXISTS";
  }
  if (error.message.includes("email rate limit exceeded")) {
    return "RATE_LIMIT";
  }
  return "GENERIC_ERROR";
};

export const getSignupErrorConfig = (errorType: SignupErrorType) => {
  return SIGNUP_ERROR_MESSAGES[errorType];
};