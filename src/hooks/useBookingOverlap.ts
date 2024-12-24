import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export const useBookingOverlap = () => {
  const { toast } = useToast();

  const checkOverlap = async (date: string, timeSlot: string, duration: string) => {
    try {
      const startHour = parseInt(timeSlot);
      const endHour = startHour + parseInt(duration);

      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date)
        .eq('payment_status', 'paid')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking booking overlap:', error);
        throw error;
      }

      const hasOverlap = existingBookings.some(booking => {
        const bookingStart = parseInt(booking.time_slot);
        const bookingEnd = bookingStart + parseInt(booking.duration);
        
        return (
          (startHour >= bookingStart && startHour < bookingEnd) ||
          (endHour > bookingStart && endHour <= bookingEnd) ||
          (startHour <= bookingStart && endHour >= bookingEnd)
        );
      });

      if (hasOverlap) {
        toast({
          title: "Créneau non disponible",
          description: "Ce créneau est déjà réservé. Veuillez en choisir un autre.",
          variant: "destructive",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in checkOverlap:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la disponibilité du créneau",
        variant: "destructive",
      });
      return true;
    }
  };

  return { checkOverlap };
};