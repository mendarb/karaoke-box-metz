import { useLoginHandler } from "./auth/useLoginHandler";
import { useSignupHandler } from "./auth/useSignupHandler";
import { useResetPasswordHandler } from "./auth/useResetPasswordHandler";
import { AuthHandlers } from "@/types/auth";
import { signOut } from "@/services/authService";

export function useAuthHandlers(): AuthHandlers {
  const { handleLogin, isLoading: isLoginLoading } = useLoginHandler();
  const { handleSignup, isLoading: isSignupLoading } = useSignupHandler();
  const { handleResetPassword, isLoading: isResetLoading } = useResetPasswordHandler();

  const handleSignOut = async () => {
    await signOut();
  };

  return {
    handleLogin,
    handleSignup,
    handleResetPassword,
    handleSignOut,
    isLoading: isLoginLoading || isSignupLoading || isResetLoading,
  };
}