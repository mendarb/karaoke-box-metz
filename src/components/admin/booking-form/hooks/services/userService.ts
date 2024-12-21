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

    console.log('📝 Aucun utilisateur existant trouvé, création d\'un nouveau compte...');
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

    console.log('📧 Email de connexion OTP envoyé à:', email);

    // Attendre un peu pour laisser le temps à l'utilisateur d'être créé
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer l'ID de l'utilisateur nouvellement créé
    const { data: newUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (newUser?.id) {
      console.log('✅ Nouvel utilisateur créé avec succès, ID:', newUser.id);
    } else {
      console.log('⚠️ L\'utilisateur a été créé mais l\'ID n\'a pas pu être récupéré immédiatement');
    }

    return newUser?.id;
  } catch (error) {
    console.error('❌ Erreur lors de la recherche/création d\'utilisateur:', error);
    throw error;
  }
};