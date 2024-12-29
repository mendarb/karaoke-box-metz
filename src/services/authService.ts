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
    console.log('🔍 Vérification de l\'existence d\'un utilisateur:', email);
    
    // Vérifier dans les réservations existantes
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('user_email', email)
      .not('user_id', 'is', null)
      .limit(1)
      .maybeSingle();

    if (bookingError) {
      console.error('❌ Erreur lors de la vérification des réservations:', bookingError);
    } else if (bookingData?.user_id) {
      console.log('✅ Utilisateur trouvé dans les réservations:', bookingData.user_id);
      return { exists: true, error: null };
    }

    console.log('✅ Aucun utilisateur existant trouvé');
    return { exists: false, error: null };
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'utilisateur:', error);
    return { exists: false, error };
  }
};