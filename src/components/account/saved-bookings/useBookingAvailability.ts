import { supabase } from "@/lib/supabase";
import { SavedBooking } from "./types";

export const useBookingAvailability = () => {
  const checkAvailability = async (bookings: SavedBooking[]) => {
    return Promise.all(
      bookings.map(async (booking) => {
        try {
          const { data: existingBookings } = await supabase
            .from('bookings')
            .select('*')
            .eq('date', booking.date)
            .eq('payment_status', 'paid')
            .neq('status', 'cancelled')
            .is('deleted_at', null);

          const isAvailable = !existingBookings?.some(existingBooking => {
            const savedStart = parseInt(booking.time_slot);
            const savedEnd = savedStart + parseInt(booking.duration);
            const existingStart = parseInt(existingBooking.time_slot);
            const existingEnd = existingStart + parseInt(existingBooking.duration);

            return (
              (savedStart >= existingStart && savedStart < existingEnd) ||
              (savedEnd > existingStart && savedEnd <= existingEnd) ||
              (savedStart <= existingStart && savedEnd >= existingEnd)
            );
          });

          return { ...booking, isAvailable };
        } catch (error) {
          console.error('Erreur lors de la vérification de disponibilité:', error);
          return { ...booking, isAvailable: false };
        }
      })
    );
  };

  return { checkAvailability };
};