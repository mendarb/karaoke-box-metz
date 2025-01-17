import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Booking {
  time_slot: string;
  duration: string;
}

export const useBookedSlots = (selectedDate: Date | null) => {
  return useQuery({
    queryKey: ['booked-slots', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('🔍 Vérification des réservations pour:', formattedDate);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors du chargement des réservations:', error);
        throw error;
      }

      console.log('✅ Réservations trouvées:', bookings);
      return bookings as Booking[];
    },
    enabled: !!selectedDate,
  });
};