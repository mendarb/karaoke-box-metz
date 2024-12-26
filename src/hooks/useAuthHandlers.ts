import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthHandlers, AuthResponse } from "@/types/auth";
import { signIn, signUp, resetPassword, checkExistingUser } from "@/services/authService";

export function useAuthHandlers(): AuthHandlers {
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

      // Vérifier si l'utilisateur existe déjà
      const { user: existingUser } = await checkExistingUser(email, password);

      if (existingUser) {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter ou réinitialiser votre mot de passe si vous l'avez oublié.",
        });
        return { success: false, shouldSwitchToLogin: true };
      }

      const { data: signUpData, error: signUpError } = await signUp(
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

      if (!signUpData.user) {
        toast({
          title: "Compte créé avec succès",
          description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
      }
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

  const handleResetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le lien de réinitialisation",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
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

  return {
    handleLogin,
    handleSignup,
    handleResetPassword,
    isLoading,
  };
}