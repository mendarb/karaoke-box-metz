import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/authService";
import { AuthResponse } from "@/types/auth";

export function useResetPasswordHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le lien de réinitialisation",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
      return { success: true, shouldSwitchToLogin: false };
    } catch (error) {
      console.error("Reset password error:", error);
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

  return { handleResetPassword, isLoading };
}