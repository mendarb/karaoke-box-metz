import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "./use-toast";

export const useBookingOverlap = () => {
  const checkOverlap = async (date: Date | undefined, timeSlot: string, duration: string) => {
    if (!date || !timeSlot || !duration) {
      return false;
    }

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Convertir les heures en nombres pour la comparaison
      const startTime = parseInt(timeSlot);
      const endTime = startTime + parseInt(duration);

      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .in('status', ['pending', 'confirmed'])
        .neq('payment_status', 'expired')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking booking overlap:', error);
        throw error;
      }

      const hasOverlap = existingBookings?.some(booking => {
        const bookingStart = parseInt(booking.time_slot);
        const bookingEnd = bookingStart + parseInt(booking.duration);

        const overlap = (
          (startTime >= bookingStart && startTime < bookingEnd) ||
          (endTime > bookingStart && endTime <= bookingEnd) ||
          (startTime <= bookingStart && endTime >= bookingEnd)
        );

        if (overlap) {
          console.log('Overlap detected:', {
            newBooking: { date: formattedDate, start: startTime, end: endTime },
            existingBooking: { 
              id: booking.id,
              date: booking.date,
              start: bookingStart,
              end: bookingEnd,
              status: booking.status
            }
          });
        }
        return overlap;
      });

      if (hasOverlap) {
        toast({
          title: "Créneau non disponible",
          description: "Ce créneau est déjà réservé. Veuillez choisir un autre horaire.",
          variant: "destructive",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking overlap:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la disponibilité",
        variant: "destructive",
      });
      return true;
    }
  };

  return { checkOverlap };
};