import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useBookingOverlap = () => {
  const { toast } = useToast();

  const checkOverlap = async (date: string, timeSlot: string, duration: string) => {
    try {
      const startTime = parseInt(timeSlot);
      const endTime = startTime + parseInt(duration);

      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date)
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
      console.error('Error in checkOverlap:', error);
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