import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const useBookedSlots = (selectedDate: Date | null) => {
  return useQuery({
    queryKey: ['booked-slots', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('🔍 Vérification des créneaux pour:', formattedDate);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid'); // Changé de is.paid à eq.paid

      if (error) {
        console.error('❌ Erreur lors du chargement des créneaux réservés:', error);
        throw error;
      }

      const bookedSlots = new Set<string>();
      bookings?.forEach(booking => {
        const startHour = parseInt(booking.time_slot);
        const duration = parseInt(booking.duration);
        
        for (let hour = startHour; hour < startHour + duration; hour++) {
          bookedSlots.add(`${hour.toString().padStart(2, '0')}:00`);
        }
      });

      return Array.from(bookedSlots);
    },
    enabled: !!selectedDate,
    staleTime: 30000,
    gcTime: 300000, // Remplace cacheTime
  });
};