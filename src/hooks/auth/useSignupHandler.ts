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
    // Prevent multiple submissions
    if (isLoading) {
      console.log("Signup already in progress, preventing duplicate submission");
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

      console.log("Creating new user account:", email);
      const { error: signUpError } = await signUp(
        email,
        password,
        fullName,
        phone
      );

      if (signUpError) {
        console.error("Signup error:", signUpError);
        
        // Gérer l'erreur de limite de taux pour les emails
        if (signUpError.message.includes("email rate limit exceeded")) {
          toast({
            title: "Trop de tentatives",
            description: "Trop d'emails ont été envoyés à cette adresse. Veuillez patienter quelques minutes avant de réessayer.",
            variant: "destructive",
          });
          return { success: false, shouldSwitchToLogin: false };
        }
        
        // Gérer l'erreur de rate limiting générale
        if (signUpError.message.includes("security purposes")) {
          const waitTime = signUpError.message.match(/\d+/)?.[0] || "30";
          toast({
            title: "Veuillez patienter",
            description: `Pour des raisons de sécurité, veuillez attendre ${waitTime} secondes avant de réessayer.`,
            variant: "default",
          });
          return { success: false, shouldSwitchToLogin: false };
        }
        
        // Si l'erreur indique que l'utilisateur existe déjà
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter ou réinitialiser votre mot de passe si vous l'avez oublié.",
          });
          return { success: false, shouldSwitchToLogin: true };
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
      console.error("Auth error:", error);
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