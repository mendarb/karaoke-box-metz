import { useLoginHandler } from "./auth/useLoginHandler";
import { useSignupHandler } from "./auth/useSignupHandler";
import { useResetPasswordHandler } from "./auth/useResetPasswordHandler";
import { AuthHandlers } from "@/types/auth";

export function useAuthHandlers(): AuthHandlers {
  const { handleLogin, isLoading: isLoginLoading } = useLoginHandler();
  const { handleSignup, isLoading: isSignupLoading } = useSignupHandler();
  const { handleResetPassword, isLoading: isResetLoading } = useResetPasswordHandler();

  return {
    handleLogin,
    handleSignup,
    handleResetPassword,
    isLoading: isLoginLoading || isSignupLoading || isResetLoading,
  };
}