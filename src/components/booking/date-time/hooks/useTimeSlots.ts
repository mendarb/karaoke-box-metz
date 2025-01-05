import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const useTimeSlots = (selectedDate: Date | null) => {
  return useQuery({
    queryKey: ['time-slots', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('Error fetching time slots:', error);
        throw error;
      }

      return bookings || [];
    },
    enabled: !!selectedDate,
  });
};