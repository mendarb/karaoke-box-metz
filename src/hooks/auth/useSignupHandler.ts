import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthResponse } from "@/types/auth";
import { validateSignupData } from "@/utils/auth/signupValidation";
import { handleSignupError } from "@/utils/auth/signupErrorHandler";
import { supabase } from "@/lib/supabase";

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
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (signUpError) {
        // Si l'erreur indique que l'utilisateur existe déjà
        if (signUpError.message?.includes("User already registered")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
            variant: "destructive",
          });
          return { success: false, shouldSwitchToLogin: true };
        }

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

      if (data.user) {
        toast({
          title: "Compte créé avec succès",
          description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
        });
        return { success: true, shouldSwitchToLogin: false };
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création du compte.",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }
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