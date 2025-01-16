import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";

export const useBookingHistory = () => {
  const { user } = useUserState();

  console.log("useBookingHistory hook initialized", { userId: user?.id });

  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found in useBookingHistory, returning empty array');
        return [];
      }

      console.log('Fetching bookings for user:', user.id);

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Bookings fetched successfully:', data);
      return data || [];
    },
    enabled: !!user,
  });
};