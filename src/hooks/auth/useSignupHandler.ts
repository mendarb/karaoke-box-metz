import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateSignupData } from "@/utils/auth/signupValidation";
import { handleSignupError } from "@/utils/auth/signupErrorHandler";
import { checkExistingUser, handleExistingUser } from "@/services/userVerificationService";
import { createUserAccount, handleSuccessfulSignup } from "@/services/signupService";

interface SignupResponse {
  success: boolean;
  shouldSwitchToLogin: boolean;
}

export function useSignupHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<SignupResponse> => {
    if (isLoading) {
      console.log("Inscription en cours, évitement de la soumission multiple");
      return { success: false, shouldSwitchToLogin: false };
    }

    const validation = validateSignupData(email, password, fullName, phone);
    if (!validation.isValid) {
      toast({
        title: "Erreur",
        description: validation.error,
        variant: "destructive",
      });
      return { success: false, shouldSwitchToLogin: false };
    }

    setIsLoading(true);
    try {
      const existingProfile = await checkExistingUser(email);
      if (existingProfile) {
        return handleExistingUser(email);
      }

      const data = await createUserAccount(email, password, fullName, phone);
      if (data?.user) {
        return handleSuccessfulSignup(email);
      }

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte.",
        variant: "destructive",
      });
      return { success: false, shouldSwitchToLogin: false };
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      const errorConfig = handleSignupError(error);
      toast({
        title: errorConfig.title,
        description: errorConfig.description,
        variant: "destructive",
      });
      return { 
        success: false, 
        shouldSwitchToLogin: errorConfig.shouldSwitchToLogin 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
}