import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const useBookedSlots = (selectedDate: Date | null) => {
  return useQuery({
    queryKey: ['booked-slots', selectedDate],
    queryFn: async () => {
      if (!selectedDate) {
        return [];
      }

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('📅 Chargement des créneaux pour:', formattedDate);

      const { data, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors du chargement des créneaux réservés:', error);
        throw error;
      }

      console.log('✅ Créneaux réservés chargés:', data);
      return data.map(booking => ({
        timeSlot: booking.time_slot,
        duration: booking.duration
      }));
    },
    enabled: !!selectedDate,
    staleTime: 30000,
    gcTime: 300000,
  });
};