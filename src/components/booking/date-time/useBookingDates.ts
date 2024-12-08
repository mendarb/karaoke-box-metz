import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay } from "date-fns";

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

  // Utiliser startOfDay pour s'assurer que la comparaison se fait au début de la journée
  const minDate = startOfDay(addDays(new Date(), settings?.bookingWindow?.startDays || 1));
  const maxDate = endOfDay(addDays(new Date(), settings?.bookingWindow?.endDays || 30));

  const isDayExcluded = (date: Date) => {
    if (!settings?.excludedDays) return false;
    
    const dateToCheck = startOfDay(date);
    return settings.excludedDays.some(excludedTimestamp => {
      const excludedDate = startOfDay(new Date(excludedTimestamp));
      return dateToCheck.getTime() === excludedDate.getTime();
    });
  };

  const getAvailableSlots = (date: Date) => {
    console.log('Getting slots for date:', date);
    console.log('Opening hours settings:', settings?.openingHours);
    
    const dayOfWeek = date.getDay().toString();
    const slots = settings?.openingHours?.[dayOfWeek]?.isOpen 
      ? settings.openingHours[dayOfWeek].slots 
      : [];
      
    console.log('Available slots:', slots);
    return slots;
  };

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots,
  };
};