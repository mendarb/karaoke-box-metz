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
        .select('time_slot, duration')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('Error checking booking overlap:', error);
        throw error;
      }

      // Vérifier tous les créneaux qui se chevauchent
      const hasOverlap = existingBookings?.some(booking => {
        const bookingStart = parseInt(booking.time_slot);
        const bookingEnd = bookingStart + parseInt(booking.duration);

        // Vérifier si les plages horaires se chevauchent
        const overlap = (
          (startHour >= bookingStart && startHour < bookingEnd) ||
          (endHour > bookingStart && endHour <= bookingEnd) ||
          (startHour <= bookingStart && endHour >= bookingEnd)
        );

        if (overlap) {
          console.log('Chevauchement détecté:', {
            newBooking: { date: formattedDate, start: startHour, end: endHour },
            existingBooking: { 
              start: bookingStart, 
              end: bookingEnd 
            }
          });
        }

        return overlap;
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
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la disponibilité du créneau",
        variant: "destructive",
      });
      return true; // En cas d'erreur, on considère qu'il y a un chevauchement par sécurité
    }
  };

  return { checkOverlap };
};