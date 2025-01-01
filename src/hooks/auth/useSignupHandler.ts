import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthResponse } from "@/types/auth";
import { validateSignupData } from "@/utils/auth/signupValidation";
import { handleSignupError } from "@/utils/auth/signupErrorHandler";
import { supabase } from "@/lib/supabase";

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

    const validation = validateSignupData(email, password, fullName, phone);
    if (!validation.isValid) {
      toast({
        title: "Erreur",
        description: validation.error,
        variant: "destructive",
      });
      return { success: false, shouldSwitchToLogin: false };
    }

    setIsLoading(true);
    try {
      console.log("Vérification de l'existence de l'email:", email);
      
      // Vérifier d'abord dans la table profiles
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim())
        .maybeSingle();

      if (profileError) {
        console.error("Erreur lors de la vérification du profil:", profileError);
        throw profileError;
      }

      if (existingProfile?.email) {
        console.log("Email déjà utilisé:", email);
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: true };
      }

      // Si l'email n'existe pas, procéder à l'inscription
      console.log("Création du compte pour:", email);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (signUpError) {
        const errorConfig = handleSignupError(signUpError);
        toast({
          title: errorConfig.title,
          description: errorConfig.description,
          variant: "destructive",
        });
        return { 
          success: false, 
          shouldSwitchToLogin: errorConfig.shouldSwitchToLogin 
        };
      }

      if (data?.user) {
        console.log("Compte créé avec succès pour:", email);
        toast({
          title: "Compte créé avec succès",
          description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
        });
        return { success: true, shouldSwitchToLogin: false };
      } else {
        console.log("Échec de création du compte - pas d'utilisateur retourné");
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création du compte.",
          variant: "destructive",
        });
        return { success: false, shouldSwitchToLogin: false };
      }
    } catch (error: any) {
      console.error("Erreur inattendue lors de l'inscription:", error);
      const errorConfig = handleSignupError(error);
      toast({
        title: errorConfig.title,
        description: errorConfig.description,
        variant: "destructive",
      });
      return { 
        success: false, 
        shouldSwitchToLogin: errorConfig.shouldSwitchToLogin 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
}