import { AuthError, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });
};

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
  phone: string
) => {
  try {
    // Vérifier d'abord si l'utilisateur existe via auth.users
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    // Si l'erreur indique que l'utilisateur existe déjà
    if (signUpError?.message?.includes("User already registered")) {
      console.log("Utilisateur déjà existant:", email);
      return {
        error: {
          message: "User already registered",
          name: "AuthError"
        }
      };
    }

    // Si pas d'erreur mais pas d'utilisateur créé, c'est probablement un compte existant
    if (!signUpError && !user) {
      console.log("Compte existant détecté pour:", email);
      return {
        error: {
          message: "User already registered",
          name: "AuthError"
        }
      };
    }

    return { data: { user }, error: signUpError };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      error: error as AuthError
    };
  }
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({
    password: newPassword.trim(),
  });
};