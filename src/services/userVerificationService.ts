import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const checkExistingUser = async (email: string) => {
  console.log("Vérification de l'existence de l'utilisateur:", email);
  
  try {
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (profileError) {
      console.error("Erreur lors de la vérification du profil:", profileError);
      throw profileError;
    }

    return existingProfile;
  } catch (error) {
    console.error("Erreur lors de la vérification du profil:", error);
    return null;
  }
};

export const handleExistingUser = (email: string) => {
  console.log("Email déjà utilisé:", email);
  toast({
    title: "Compte existant",
    description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
    variant: "destructive",
  });
  return { success: false, shouldSwitchToLogin: true };
};