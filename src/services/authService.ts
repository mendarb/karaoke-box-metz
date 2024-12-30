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
    // Vérifier d'abord si l'utilisateur existe
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', email)
      .single();

    if (existingUser) {
      return {
        error: {
          message: "User already registered",
          name: "AuthError"
        } as AuthError
      };
    }

    // Si l'utilisateur n'existe pas, procéder à l'inscription
    return await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });
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