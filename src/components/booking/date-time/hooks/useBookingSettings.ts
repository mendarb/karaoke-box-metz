import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay } from "date-fns";

/**
 * Hook to manage booking settings and date boundaries
 * @returns Object containing settings, loading state, and date boundaries
 */
export const useBookingSettings = () => {
  const { data: settings, isLoading } = useQuery({
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

  const today = startOfDay(new Date());
  
  // En mode test, on permet de réserver dès aujourd'hui et jusqu'à un an
  const minDate = settings?.isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = settings?.isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  console.log('Date boundaries:', { 
    minDate, 
    maxDate, 
    isTestMode: settings?.isTestMode,
    startDays: settings?.bookingWindow?.startDays,
    endDays: settings?.bookingWindow?.endDays
  });

  return {
    settings,
    isLoading,
    minDate,
    maxDate
  };
};