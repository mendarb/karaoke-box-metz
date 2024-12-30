import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/services/authService";
import { AuthResponse } from "@/types/auth";
import { validateSignupData } from "@/utils/auth/signupValidation";
import { handleSignupError } from "@/utils/auth/signupErrorHandler";

export function useSignupHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<AuthResponse> => {
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
      console.log("Tentative de création de compte:", email);
      const { error: signUpError } = await signUp(
        email,
        password,
        fullName,
        phone
      );

      if (signUpError) {
        const errorConfig = handleSignupError(signUpError);
        toast({
          title: errorConfig.title,
          description: errorConfig.description,
          variant: "destructive",
        });
        return { 
          success: false, 
          shouldSwitchToLogin: errorConfig.shouldSwitchToLogin 
        };
      }

      toast({
        title: "Compte créé avec succès",
        description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
      });
      return { success: true, shouldSwitchToLogin: false };
    } catch (error: any) {
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