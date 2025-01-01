import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const checkExistingUser = async (email: string) => {
  console.log("Vérification de l'existence de l'utilisateur:", email);
  
  const { data: existingProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (profileError && !profileError.message?.includes('No rows found')) {
    console.error("Erreur lors de la vérification du profil:", profileError);
    throw profileError;
  }

  return existingProfile;
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