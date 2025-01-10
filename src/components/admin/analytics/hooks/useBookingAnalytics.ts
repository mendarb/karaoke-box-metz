import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useBookingAnalytics = () => {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['analytics-bookings-details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stepsTracking, isLoading: isLoadingTracking } = useQuery({
    queryKey: ['analytics-steps-tracking'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('booking_steps_tracking')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      console.log('Steps tracking data:', data);
      return data;
    }
  });

  return {
    bookings,
    stepsTracking,
    isLoading: isLoadingBookings || isLoadingTracking
  };
};