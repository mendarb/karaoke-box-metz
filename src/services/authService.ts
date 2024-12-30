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
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', email)
      .maybeSingle();

    if (existingUser) {
      return {
        error: {
          message: "User already registered",
          name: "AuthError"
        }
      };
    }

    return await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
  } catch (error) {
    console.error("Erreur dans signUp:", error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/account/reset-password`,
  });
};