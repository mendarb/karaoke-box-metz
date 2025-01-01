import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const createUserAccount = async (
  email: string,
  password: string,
  fullName: string,
  phone: string
) => {
  console.log("Création du compte pour:", email);
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (signUpError) throw signUpError;

  return data;
};

export const handleSuccessfulSignup = (email: string) => {
  console.log("Compte créé avec succès pour:", email);
  toast({
    title: "Compte créé avec succès",
    description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
  });
  return { success: true, shouldSwitchToLogin: false };
};