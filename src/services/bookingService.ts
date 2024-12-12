import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Erreur mise à jour réservation:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Réservation non trouvée');
  }

  return data;
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur récupération réservations:', error);
    throw error;
  }

  return data || [];
};