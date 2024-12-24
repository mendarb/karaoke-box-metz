import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const useAvailableSlots = (selectedDate: Date | undefined) => {
  return useQuery({
    queryKey: ['available-slots', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];

      // Formater la date au format YYYY-MM-DD pour Supabase
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      console.log('🔍 Vérification des créneaux pour:', {
        date: formattedDate,
        originalDate: selectedDate
      });

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('❌ Erreur lors de la récupération des réservations:', error);
        throw error;
      }

      console.log('✅ Réservations trouvées:', bookings?.length || 0);
      return bookings || [];
    },
    enabled: !!selectedDate,
  });
};