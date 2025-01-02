import { supabase } from "@/lib/supabase";

export const checkExistingUser = async (email: string) => {
  console.log("Vérification de l'existence de l'utilisateur:", email);
  
  try {
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (profileError) {
      console.error("Erreur lors de la vérification du profil:", profileError);
      throw profileError;
    }

    return existingProfile;
  } catch (error) {
    console.error("Erreur lors de la vérification du profil:", error);
    throw error;
  }
};

export const handleExistingUser = (email: string) => {
  return {
    success: false,
    shouldSwitchToLogin: true,
    message: `Un compte existe déjà avec l'email ${email}. Veuillez vous connecter.`,
  };
};