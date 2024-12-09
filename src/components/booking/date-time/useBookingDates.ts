import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay } from "date-fns";

export const useBookingDates = () => {
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('Fetching booking settings');
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*');

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      console.log('Raw settings data:', data);

      const formattedSettings = {
        bookingWindow: { startDays: 1, endDays: 30 },
        openingHours: {
          0: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
          1: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
          2: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
          3: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
          4: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
          5: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
          6: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
        },
        excludedDays: [],
      };

      data?.forEach(setting => {
        console.log('Processing setting:', setting.key, setting.value);
        switch (setting.key) {
          case 'booking_window':
            formattedSettings.bookingWindow = setting.value;
            break;
          case 'opening_hours':
            formattedSettings.openingHours = setting.value;
            console.log('Updated opening hours:', setting.value);
            break;
          case 'excluded_days':
            formattedSettings.excludedDays = setting.value;
            break;
        }
      });

      console.log('Formatted settings:', formattedSettings);
      return formattedSettings;
    },
    // Ajout de refetchOnWindowFocus et refetchInterval pour s'assurer que les données sont à jour
    refetchOnWindowFocus: true,
    refetchInterval: 5000
  });

  const minDate = startOfDay(addDays(new Date(), settings?.bookingWindow?.startDays || 1));
  const maxDate = endOfDay(addDays(new Date(), settings?.bookingWindow?.endDays || 30));

  console.log('Date range:', { minDate, maxDate });

  const isDayExcluded = (date: Date) => {
    if (!settings?.excludedDays) return false;
    
    const dateToCheck = startOfDay(date);
    const isExcluded = settings.excludedDays.some(excludedTimestamp => {
      const excludedDate = startOfDay(new Date(excludedTimestamp));
      return dateToCheck.getTime() === excludedDate.getTime();
    });

    console.log('Checking if date is excluded:', {
      date: dateToCheck,
      isExcluded,
      excludedDays: settings.excludedDays
    });

    return isExcluded;
  };

  const getAvailableSlots = (date: Date) => {
    console.log('Getting slots for date:', date);
    console.log('Opening hours settings:', settings?.openingHours);
    
    if (!settings?.openingHours) {
      console.log('No opening hours settings found');
      return [];
    }

    const dayOfWeek = date.getDay().toString();
    console.log('Day of week:', dayOfWeek);
    
    const daySettings = settings.openingHours[dayOfWeek];
    console.log('Day settings:', daySettings);

    if (!daySettings?.isOpen) {
      console.log('Day is closed');
      return [];
    }

    const slots = daySettings.slots || [];
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