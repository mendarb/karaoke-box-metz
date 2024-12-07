import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const updateBookingInDatabase = async (bookingId: string, newStatus: string): Promise<Booking> => {
  const { data: bookings, error: updateError } = await supabase
    .from('bookings')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select('*');

  if (updateError) {
    console.error('Error updating booking:', updateError);
    throw new Error('Erreur lors de la mise à jour de la réservation');
  }

  if (!bookings || bookings.length === 0) {
    console.error('No booking found with id:', bookingId);
    throw new Error('Réservation non trouvée');
  }

  console.log('Successfully updated booking:', bookings[0]);
  return bookings[0];
};

export const verifyAdminAccess = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('Session error:', sessionError);
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }

  const userEmail = session.user.email;
  if (!userEmail || userEmail !== 'mendar.bouchali@gmail.com') {
    console.error('User not admin:', userEmail);
    throw new Error('Permission refusée');
  }

  return session;
};