import { supabase } from "@/lib/supabase";

export const findOrCreateUser = async (email: string, fullName: string, phone: string) => {
  console.log('🔍 Recherche ou création d\'utilisateur :', {
    email,
    fullName,
    phone
  });

  try {
    // Chercher d'abord l'utilisateur existant
    console.log('👤 Recherche d\'un utilisateur existant avec l\'email:', email);
    const { data: existingUser } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('user_email', email)
      .not('user_id', 'is', null)
      .limit(1)
      .maybeSingle();

    if (existingUser?.user_id) {
      console.log('✅ Utilisateur existant trouvé avec l\'ID:', existingUser.user_id);
      return existingUser.user_id;
    }

    // Pour les réservations admin, on ne crée pas de compte utilisateur
    // On retourne null pour indiquer qu'il n'y a pas d'utilisateur associé
    console.log('📝 Pas d\'utilisateur existant trouvé, mais pas de création de compte en mode admin');
    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la recherche d\'utilisateur:', error);
    throw error;
  }
};