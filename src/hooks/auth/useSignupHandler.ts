import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUp, checkExistingUser } from "@/services/authService";
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

      const { exists, error: checkError } = await checkExistingUser(email);

      if (checkError) {
        console.error("Error checking user:", checkError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de l'email",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }

      if (exists) {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter ou réinitialiser votre mot de passe si vous l'avez oublié.",
        });
        return { success: false, shouldSwitchToLogin: true };
      }

      const { error: signUpError } = await signUp(
        email,
        password,
        fullName,
        phone
      );

      if (signUpError) {
        console.error("Signup error:", signUpError);
        toast({
          title: "Erreur",
          description: signUpError.message,
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