import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay, parse, addHours, isBefore } from "date-fns";

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
        bookingWindow: { startDays: 0, endDays: 30 },
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
        isTestMode: false
      };

      data?.forEach(setting => {
        console.log('Processing setting:', setting.key, setting.value);
        switch (setting.key) {
          case 'booking_window':
            if (setting.value) {
              formattedSettings.bookingWindow = setting.value;
            }
            break;
          case 'opening_hours':
            if (setting.value) {
              formattedSettings.openingHours = setting.value;
              console.log('Updated opening hours:', setting.value);
            }
            break;
          case 'excluded_days':
            if (setting.value) {
              formattedSettings.excludedDays = setting.value;
            }
            break;
          case 'is_test_mode':
            formattedSettings.isTestMode = setting.value === true;
            break;
        }
      });

      console.log('Formatted settings:', formattedSettings);
      return formattedSettings;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 5000
  });

  const today = startOfDay(new Date());
  const minDate = settings?.isTestMode 
    ? today
    : startOfDay(addDays(today, settings?.bookingWindow?.startDays || 0));
    
  const maxDate = settings?.isTestMode
    ? endOfDay(addDays(today, 365))
    : endOfDay(addDays(today, settings?.bookingWindow?.endDays || 30));

  const isDayExcluded = (date: Date) => {
    if (!settings?.excludedDays) return false;
    if (settings?.isTestMode) return false;
    
    const dateToCheck = startOfDay(date);

    if (isBefore(dateToCheck, today)) {
      console.log('Date is in the past:', dateToCheck);
      return true;
    }
    
    const isExcluded = settings.excludedDays.some(excludedTimestamp => {
      const excludedDate = startOfDay(new Date(excludedTimestamp));
      return dateToCheck.getTime() === excludedDate.getTime();
    });

    return isExcluded;
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    const daySettings = settings?.openingHours?.[date.getDay().toString()];
    if (!daySettings?.slots) return 0;

    const slotIndex = daySettings.slots.indexOf(timeSlot);
    if (slotIndex === -1) return 0;

    // Si c'est le dernier créneau, on ne permet qu'une heure
    if (slotIndex === daySettings.slots.length - 1) {
      console.log('Last slot of the day, limiting to 1 hour');
      return 1;
    }

    // Pour les autres créneaux, on calcule combien d'heures sont disponibles
    // en fonction de la position du créneau
    const remainingSlots = daySettings.slots.length - slotIndex - 1;
    const maxPossibleHours = Math.min(4, remainingSlots + 1);

    // Vérifier les réservations existantes
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled');

    if (!bookings) return maxPossibleHours;

    const currentSlotTime = parseInt(timeSlot.split(':')[0]);
    
    // Trouver la première réservation qui bloque
    const blockingBooking = bookings.find(booking => {
      const bookingTime = parseInt(booking.time_slot.split(':')[0]);
      return bookingTime > currentSlotTime && bookingTime < currentSlotTime + maxPossibleHours;
    });

    if (blockingBooking) {
      const bookingTime = parseInt(blockingBooking.time_slot.split(':')[0]);
      const availableHours = bookingTime - currentSlotTime;
      console.log(`Blocking booking found at ${bookingTime}h, limiting to ${availableHours} hours`);
      return availableHours;
    }

    console.log(`No blocking bookings found, ${maxPossibleHours} hours available`);
    return maxPossibleHours;
  };

  const getAvailableSlots = async (date: Date) => {
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

    if (!settings.isTestMode && !daySettings?.isOpen) {
      console.log('Day is closed and not in test mode');
      return [];
    }

    const slots = daySettings?.slots || [];
    console.log('Available slots before filtering:', slots);

    // Filter slots that have at least 1 hour available
    const availableSlots = await Promise.all(
      slots.map(async (slot) => {
        const availableHours = await getAvailableHoursForSlot(date, slot);
        return { slot, availableHours };
      })
    );

    const filteredSlots = availableSlots
      .filter(({ availableHours }) => availableHours >= 1)
      .map(({ slot }) => slot);

    console.log('Filtered available slots:', filteredSlots);
    return filteredSlots;
  };

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots,
    getAvailableHoursForSlot
  };
};