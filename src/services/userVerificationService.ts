import { supabase } from "@/lib/supabase";
import { SignupResult } from "@/types/auth";

export const checkExistingUser = async (email: string) => {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    
    return data !== null;
  } catch (error) {
    console.error("Erreur lors de la vérification du profil:", error);
    throw error;
  }
};

export const handleExistingUser = (email: string): SignupResult => {
  return {
    success: false,
    message: `Un compte existe déjà avec l'email ${email}. Veuillez vous connecter.`,
    shouldSwitchToLogin: true
  };
};