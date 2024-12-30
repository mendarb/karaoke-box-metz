import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/services/authService";
import { AuthResponse } from "@/types/auth";
import { getSignupErrorType, getSignupErrorConfig } from "@/utils/auth/signupErrorHandler";

export function useSignupHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateSignupData = (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): boolean => {
    if (!fullName || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSignupSuccess = () => {
    toast({
      title: "Compte créé avec succès",
      description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
    });
    return { success: true, shouldSwitchToLogin: false };
  };

  const handleSignupError = (error: any) => {
    console.error("Erreur d'inscription:", error);
    const errorType = getSignupErrorType(error);
    const errorConfig = getSignupErrorConfig(errorType);

    toast({
      title: errorConfig.title,
      description: errorConfig.description,
      variant: errorConfig.variant,
    });

    return { 
      success: false, 
      shouldSwitchToLogin: errorConfig.shouldSwitchToLogin 
    };
  };

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

    if (!validateSignupData(email, password, fullName, phone)) {
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
        return handleSignupError(signUpError);
      }

      return handleSignupSuccess();
    } catch (error: any) {
      return handleSignupError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
}