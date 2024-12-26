import { supabase } from "@/lib/supabase";
import { ProfileFormData } from "@/hooks/useProfileData";

export const updateProfile = async (userId: string, data: ProfileFormData) => {
  // Vérifier si le profil existe
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  if (!existingProfile) {
    // Créer un nouveau profil
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      }]);

    if (createError) throw createError;
  } else {
    // Mettre à jour le profil existant
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      })
      .eq('id', userId);

    if (updateError) throw updateError;
  }

  // Mettre à jour les réservations existantes
  const fullName = `${data.first_name} ${data.last_name}`.trim();
  const { error: bookingsUpdateError } = await supabase
    .from('bookings')
    .update({
      user_name: fullName,
      user_phone: data.phone,
    })
    .eq('user_id', userId);

  if (bookingsUpdateError) throw bookingsUpdateError;

  // Recharger les données du profil
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return updatedProfile;
};