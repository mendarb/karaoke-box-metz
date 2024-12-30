import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/services/authService";
import { AuthResponse } from "@/types/auth";

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

    setIsLoading(true);
    try {
      if (!fullName || !phone) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }

      console.log("Tentative de création de compte:", email);
      const { error: signUpError } = await signUp(
        email,
        password,
        fullName,
        phone
      );

      if (signUpError) {
        console.error("Erreur d'inscription:", signUpError);
        
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
            variant: "default",
          });
          return { success: false, shouldSwitchToLogin: true };
        }
        
        if (signUpError.message.includes("email rate limit exceeded")) {
          toast({
            title: "Trop de tentatives",
            description: "Trop d'emails ont été envoyés à cette adresse. Veuillez patienter quelques minutes.",
            variant: "destructive",
          });
          return { success: false, shouldSwitchToLogin: false };
        }

        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }

      toast({
        title: "Compte créé avec succès",
        description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
      });
      return { success: true, shouldSwitchToLogin: false };
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return { success: false, shouldSwitchToLogin: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
}