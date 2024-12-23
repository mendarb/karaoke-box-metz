import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getBookingDateConfig, isDayExcluded } from "../utils/dateUtils";
import { getAvailableSlots, getAvailableHoursForSlot } from "../utils/slotAvailabilityUtils";
import type { BookingDateConfig } from "../types/bookingDateTypes";

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

  const config: BookingDateConfig = getBookingDateConfig(settings);

  return {
    settings,
    minDate: config.minDate,
    maxDate: config.maxDate,
    isDayExcluded: (date: Date) => isDayExcluded(date, config),
    getAvailableSlots: (date: Date) => getAvailableSlots(date, config),
    getAvailableHoursForSlot: (date: Date, timeSlot: string) => 
      getAvailableHoursForSlot(date, timeSlot, config),
    isTestMode: config.isTestMode
  };
};