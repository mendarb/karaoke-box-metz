import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const useBookingOverlap = () => {
  const { toast } = useToast();

  const checkOverlap = async (date: string, timeSlot: string, duration: string) => {
    try {
      console.log('🔍 Checking overlap for:', { date, timeSlot, duration });
      
      // Format the date to YYYY-MM-DD
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');
      console.log('📅 Formatted date:', formattedDate);

      const startTime = parseInt(timeSlot);
      const endTime = startTime + parseInt(duration);

      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('❌ Error checking booking overlap:', error);
        throw error;
      }

      console.log('📚 Existing bookings:', existingBookings);

      const hasOverlap = existingBookings?.some(booking => {
        const bookingStart = parseInt(booking.time_slot);
        const bookingEnd = bookingStart + parseInt(booking.duration);

        const overlap = (
          (startTime >= bookingStart && startTime < bookingEnd) ||
          (endTime > bookingStart && endTime <= bookingEnd) ||
          (startTime <= bookingStart && endTime >= bookingEnd)
        );

        if (overlap) {
          console.log('⚠️ Found overlap with booking:', booking);
        }

        return overlap;
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
      console.error('❌ Error in checkOverlap:', error);
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