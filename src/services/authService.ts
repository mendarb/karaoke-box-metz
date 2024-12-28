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
  try {
    console.log('Checking existing user in bookings:', email);
    // Vérifier d'abord dans les réservations existantes
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
      console.log('User found in bookings:', bookingData.user_id);
      return { exists: true, error: null };
    }

    // Si l'utilisateur n'est pas trouvé dans les réservations,
    // on essaie de se connecter avec un mot de passe invalide pour voir si l'email existe
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: 'dummy_password_to_check_existence',
    });

    // Si l'erreur indique "Invalid login credentials", cela signifie que l'email existe
    if (error?.message.includes('Invalid login credentials')) {
      console.log('User exists in auth system');
      return { exists: true, error: null };
    }

    // Si l'erreur est différente ou s'il n'y a pas d'erreur (ce qui ne devrait pas arriver),
    // on considère que l'utilisateur n'existe pas
    console.log('No existing user found');
    return { exists: false, error: null };
  } catch (error) {
    console.error('Error in checkExistingUser:', error);
    return { exists: false, error };
  }
};