import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/services/authService";
import { AuthResponse } from "@/types/auth";

export function useLoginHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // Basic validation
      if (!email || !password) {
        toast({
          title: "Erreur",
          description: "Veuillez saisir un email et un mot de passe",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }

      const { error } = await signIn(email, password);

      if (error) {
        console.error("Auth error details:", error);
        
        const errorMessage = 
          error.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect" 
            : error.message.includes("Email not confirmed")
            ? "Veuillez confirmer votre email avant de vous connecter"
            : "Une erreur de connexion est survenue";

        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      return { success: true, shouldSwitchToLogin: false };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
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

  return { handleLogin, isLoading };
}