import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PriceSettings } from "./types";

const DEFAULT_SETTINGS: PriceSettings = {
  perHour: 30,
  perPerson: 5,
};

export const usePriceSettings = () => {
  return useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .single();

      if (error) {
        console.error('Error fetching price settings:', error);
        return { basePrice: DEFAULT_SETTINGS };
      }

      if (!data?.value?.basePrice) {
        console.log('No price settings found, using defaults');
        return { basePrice: DEFAULT_SETTINGS };
      }

      console.log('Fetched price settings:', data.value);
      return data.value;
    },
    retry: 1,
    staleTime: 30000,
  });
};