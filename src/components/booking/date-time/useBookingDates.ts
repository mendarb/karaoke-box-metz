import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays } from "date-fns";

export const useBookingDates = () => {
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*');

      if (error) throw error;

      const formattedSettings = {
        bookingWindow: { startDays: 1, endDays: 30 },
        openingHours: {},
        excludedDays: [],
      };

      data?.forEach(setting => {
        switch (setting.key) {
          case 'booking_window':
            formattedSettings.bookingWindow = setting.value;
            break;
          case 'opening_hours':
            formattedSettings.openingHours = setting.value;
            break;
          case 'excluded_days':
            formattedSettings.excludedDays = setting.value;
            break;
        }
      });

      return formattedSettings;
    }
  });

  const minDate = addDays(new Date(), settings?.bookingWindow?.startDays || 1);
  const maxDate = addDays(new Date(), settings?.bookingWindow?.endDays || 30);

  // Reset hours to start of day for consistent comparison
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(23, 59, 59, 999);

  const isDayExcluded = (date: Date) => {
    if (!settings?.excludedDays) return false;
    return settings.excludedDays.some(excludedTimestamp => {
      const excludedDate = new Date(excludedTimestamp);
      return (
        date.getDate() === excludedDate.getDate() &&
        date.getMonth() === excludedDate.getMonth() &&
        date.getFullYear() === excludedDate.getFullYear()
      );
    });
  };

  const getAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay().toString();
    return settings?.openingHours?.[dayOfWeek]?.isOpen 
      ? settings.openingHours[dayOfWeek].slots 
      : [];
  };

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots,
  };
};