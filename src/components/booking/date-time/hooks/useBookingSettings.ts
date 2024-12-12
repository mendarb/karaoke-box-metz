import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useBookingSettings = () => {
  return useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('Fetching booking settings...');
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      console.log('Loaded settings:', data?.value);
      return data?.value;
    },
  });
};