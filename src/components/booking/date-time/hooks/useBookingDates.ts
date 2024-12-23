import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getDateRange, isDayExcluded } from "../utils/dateConversion";
import { getAvailableSlots, getAvailableHoursForSlot } from "../utils/slotManagement";

export const useBookingDates = () => {
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      return data?.value;
    },
  });

  const isTestMode = import.meta.env.VITE_STRIPE_MODE === 'test';
  const { minDate, maxDate } = getDateRange(settings, isTestMode);

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded: (date: Date) => isDayExcluded(date, settings, minDate, maxDate, isTestMode),
    getAvailableSlots: (date: Date) => getAvailableSlots(date, settings),
    getAvailableHoursForSlot: (date: Date, timeSlot: string) => 
      getAvailableHoursForSlot(date, timeSlot, settings),
    isTestMode
  };
};