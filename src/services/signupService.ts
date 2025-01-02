import { supabase } from "@/lib/supabase";
import { SignupData, SignupResult } from "@/types/auth";
import { handleSignupError } from "@/utils/auth/signupErrorHandler";
import { toast } from "@/components/ui/use-toast";

export const signupUser = async (data: SignupData): Promise<SignupResult> => {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("User already registered")) {
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
      throw signUpError;
    }

    // Envoyer l'email de bienvenue
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          to: data.email,
          fullName: data.fullName,
        }
      });
      console.log('✉️ Email de bienvenue envoyé à:', data.email);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue:", emailError);
      // On ne bloque pas l'inscription si l'envoi de l'email échoue
    }

    return {
      success: true,
      message: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte.",
      data: authData,
      shouldSwitchToLogin: false
    };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return handleSignupError(error);
  }
};