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
      
      const { data: overlappingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .eq('time_slot', timeSlot)
        .is('deleted_at', null);

      if (overlappingBookings && overlappingBookings.length > 0) {
        toast({
          title: "Créneau non disponible",
          description: "Ce créneau est déjà réservé",
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