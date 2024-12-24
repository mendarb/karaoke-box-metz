import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useBookingMode = () => {
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('🔧 Fetching booking settings for test mode...');
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      console.log('🔧 Test mode from settings:', data?.value?.isTestMode);
      return data?.value;
    },
  });

  return { isTestMode: settings?.isTestMode || false };
};