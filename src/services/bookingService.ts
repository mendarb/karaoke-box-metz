import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const updateBookingInDatabase = async (bookingId: string, newStatus: string): Promise<Booking> => {
  console.log('Début de la mise à jour de la réservation:', bookingId, 'avec le statut:', newStatus);

  // Vérifions d'abord si la réservation existe
  const { data: bookings, error: fetchError } = await supabase
    .from('bookings')
    .select()
    .eq('id', bookingId);

  if (fetchError) {
    console.error('Erreur lors de la vérification de la réservation:', fetchError);
    throw new Error('Erreur lors de la vérification de la réservation');
  }

  if (!bookings || bookings.length === 0) {
    console.error('Aucune réservation trouvée avec l\'id:', bookingId);
    throw new Error('Réservation introuvable');
  }

  console.log('Réservation trouvée, procédons à la mise à jour');

  const { data: updatedBookings, error: updateError } = await supabase
    .from('bookings')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select();

  if (updateError) {
    console.error('Erreur lors de la mise à jour:', updateError);
    throw new Error('Erreur lors de la mise à jour de la réservation');
  }

  if (!updatedBookings || updatedBookings.length === 0) {
    console.error('Aucune réservation mise à jour avec l\'id:', bookingId);
    throw new Error('La mise à jour a échoué');
  }

  console.log('Mise à jour réussie:', updatedBookings[0]);
  return updatedBookings[0];
};