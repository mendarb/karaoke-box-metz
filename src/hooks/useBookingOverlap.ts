import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";
import { format } from "date-fns";

export const useBookingOverlap = () => {
  const { toast } = useToast();

  const checkOverlap = async (date: Date | string, timeSlot: string, duration: string) => {
    try {
      const startHour = parseInt(timeSlot);
      const endHour = startHour + parseInt(duration);

      // Convert Date object to YYYY-MM-DD format if needed
      const formattedDate = date instanceof Date 
        ? format(date, 'yyyy-MM-dd')
        : date;

      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .eq('payment_status', 'paid')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking booking overlap:', error);
        throw error;
      }

      const hasOverlap = existingBookings?.some(booking => {
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
          title: "Créneau indisponible",
          description: "Ce créneau est déjà réservé. Veuillez en choisir un autre.",
          variant: "destructive",
        });
      }

      return hasOverlap;
    } catch (error) {
      console.error('Error in checkOverlap:', error);
      return false;
    }
  };

  return { checkOverlap };
};