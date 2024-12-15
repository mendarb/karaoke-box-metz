import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";

export const useBookingHistory = () => {
  const { user } = useUserState();

  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID found');
        return [];
      }

      console.log('Fetching bookings for user:', user.id);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Fetched bookings:', data);
      return data || [];
    },
    enabled: !!user?.id,
  });
};