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

      // Proceed with signup
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) {
        console.error("Erreur lors de l'inscription:", signUpError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive"
      });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Erreur inconnue",
        shouldSwitchToLogin: false
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
};