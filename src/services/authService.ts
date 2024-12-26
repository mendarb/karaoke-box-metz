import { supabase } from "@/integrations/supabase/client";

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
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/account/reset-password`,
  });
};

export const checkExistingUser = async (email: string) => {
  // D'abord, vérifier dans auth.users via une réservation existante
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .select('user_id')
    .eq('user_email', email)
    .not('user_id', 'is', null)
    .limit(1)
    .maybeSingle();

  if (bookingError) {
    console.error('Error checking bookings:', bookingError);
    return { exists: false, error: bookingError };
  }

  if (bookingData?.user_id) {
    return { exists: true, error: null };
  }

  // Si aucune réservation n'est trouvée, essayer de se connecter avec un email magique
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: false,
    }
  });

  // Si pas d'erreur "User not found", cela signifie que l'utilisateur existe
  const userExists = !error || !error.message.includes('User not found');
  
  return { 
    exists: userExists, 
    error: null 
  };
};