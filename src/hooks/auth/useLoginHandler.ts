import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/services/authService";

export function useLoginHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Auth error:", error);
        const errorMessage = error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : error.message.includes("Email not confirmed")
          ? "Veuillez confirmer votre email avant de vous connecter"
          : error.message;

        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      return true;
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}