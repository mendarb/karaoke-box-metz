import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useBookingHistory = () => {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      return data;
    },
    refetchInterval: 5000,
  });
};