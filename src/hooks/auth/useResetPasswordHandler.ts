import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AuthResponse } from "@/types/auth";

export function useResetPasswordHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // Remove any trailing colons and ensure proper URL format
      const baseUrl = window.location.origin.replace(/:\/*$/, '');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        if (error.status === 429) {
          toast({
            title: "Trop de tentatives",
            description: "Veuillez patienter quelques minutes avant de réessayer",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible d'envoyer le lien de réinitialisation",
            variant: "destructive",
          });
        }
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