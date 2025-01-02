import { supabase } from "@/lib/supabase";
import { SignupData, SignupResult } from "@/types/auth";
import { handleSignupError } from "@/utils/auth/signupErrorHandler";

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

    if (signUpError) throw signUpError;

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