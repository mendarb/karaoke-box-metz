import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { SignupResult } from "@/types/auth";

export const useSignupHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    phoneCountryCode: string
  ): Promise<SignupResult> => {
    setIsLoading(true);
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("La requête a pris trop de temps. Veuillez réessayer.")), 10000);
      });

      // Check if user exists first
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
        });
        return { 
          success: false, 
          message: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          shouldSwitchToLogin: true
        };
      }

      // Race between signup and timeout
      const signupPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_country_code: phoneCountryCode,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      const { data: authData, error: signUpError } = await Promise.race([
        signupPromise,
        timeoutPromise
      ]) as any;

      if (signUpError) {
        console.error("Erreur lors de l'inscription:", signUpError);
        toast({
          title: "Erreur",
          description: signUpError.message === "Error sending confirmation email" 
            ? "Impossible d'envoyer l'email de confirmation. Veuillez réessayer."
            : "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
          variant: "destructive"
        });
        return { 
          success: false, 
          message: signUpError.message,
          shouldSwitchToLogin: false
        };
      }

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });

      return {
        success: true,
        message: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte.",
        data: authData,
        shouldSwitchToLogin: false
      };

    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      
      toast({
        title: "Erreur",
        description: errorMessage === "La requête a pris trop de temps. Veuillez réessayer." 
          ? errorMessage 
          : "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive"
      });
      
      return { 
        success: false, 
        message: errorMessage,
        shouldSwitchToLogin: false
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
};