import { supabase } from "@/lib/supabase";

export const findOrCreateUser = async (email: string, fullName: string, phone: string) => {
  try {
    // Chercher d'abord l'utilisateur existant
    const { data: existingUser } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('user_email', email)
      .not('user_id', 'is', null)
      .limit(1)
      .maybeSingle();

    if (existingUser?.user_id) {
      return existingUser.user_id;
    }

    // Créer un nouveau compte utilisateur
    const { data: authData } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        }
      }
    });

    // Attendre un peu pour laisser le temps à l'utilisateur d'être créé
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer l'ID de l'utilisateur nouvellement créé
    const { data: newUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    return newUser?.id;
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    throw error;
  }
};