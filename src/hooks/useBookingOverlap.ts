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
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking booking overlap:', error);
        throw error;
      }

      const hasOverlap = existingBookings?.some(booking => {
        const bookingStart = parseInt(booking.time_slot);
        const bookingEnd = bookingStart + parseInt(booking.duration);

        return (
          (startTime >= bookingStart && startTime < bookingEnd) ||
          (endTime > bookingStart && endTime <= bookingEnd) ||
          (startTime <= bookingStart && endTime >= bookingEnd)
        );
      });

      if (hasOverlap) {
        toast({
          title: "Créneau non disponible",
          description: "Ce créneau chevauche une réservation existante",
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