import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";

export const useBookingHistory = () => {
  const { user } = useUserState();

  console.log("🔍 useBookingHistory - Starting hook execution");
  console.log("🔍 useBookingHistory - Current user:", user);

  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      console.log("🔍 useBookingHistory - QueryFn starting");
      
      if (!user) {
        console.log("❌ useBookingHistory - No user found, returning empty array");
        return [];
      }

      console.log("🔍 useBookingHistory - Fetching bookings for user:", user.id);

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('date', { ascending: false });

      if (error) {
        console.error("❌ useBookingHistory - Error fetching bookings:", error);
        throw error;
      }

      console.log("✅ useBookingHistory - Bookings fetched successfully:", data);
      return data || [];
    },
    enabled: !!user,
  });
};