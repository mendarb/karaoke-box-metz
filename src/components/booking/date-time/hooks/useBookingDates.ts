import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { isDayExcluded } from "../utils/dateConversion";
import { getAvailableSlots } from "../utils/slotUtils";
import { startOfDay, addDays } from "date-fns";

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

  const isTestMode = settings?.isTestMode || false;
  
  // Calculer les dates min et max basées sur les paramètres
  const today = startOfDay(new Date());
  const minDate = isTestMode 
    ? today 
    : settings?.bookingWindow?.startDate 
      ? startOfDay(new Date(settings.bookingWindow.startDate))
      : addDays(today, 1);
      
  const maxDate = isTestMode
    ? addDays(today, 365)
    : settings?.bookingWindow?.endDate
      ? startOfDay(new Date(settings.bookingWindow.endDate))
      : addDays(today, 30);

  console.log('📅 Plage de dates:', { minDate, maxDate, isTestMode });

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded: (date: Date) => isDayExcluded(date, settings),
    getAvailableSlots: (date: Date) => getAvailableSlots(date, settings),
    isTestMode
  };
};