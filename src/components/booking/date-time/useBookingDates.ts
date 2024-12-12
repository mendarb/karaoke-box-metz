import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay, parse, addHours, isBefore } from "date-fns";

export const useBookingDates = () => {
  const { data: settings } = useQuery({
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

      console.log('Fetched settings:', data?.value);
      return data?.value || {
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
    },
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
    return isBefore(dateToCheck, today) || settings.excludedDays.some(excludedTimestamp => {
      const excludedDate = startOfDay(new Date(excludedTimestamp));
      return dateToCheck.getTime() === excludedDate.getTime();
    });
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    const daySettings = settings?.openingHours?.[date.getDay().toString()];
    if (!daySettings?.slots) return 0;

    const slots = daySettings.slots;
    const slotIndex = slots.indexOf(timeSlot);
    if (slotIndex === -1) return 0;

    // Si c'est le dernier créneau, on ne permet qu'une heure
    if (slotIndex === slots.length - 1) {
      console.log('Last slot of the day, limiting to 1 hour');
      return 1;
    }

    // Pour les autres créneaux, calculer les heures disponibles en fonction de la position
    const remainingSlots = slots.length - slotIndex - 1;
    const maxPossibleHours = Math.min(4, remainingSlots + 1);

    // Vérifier les réservations existantes
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

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

    return maxPossibleHours;
  };

  const getAvailableSlots = async (date: Date) => {
    if (!settings?.openingHours) {
      console.log('No opening hours settings found');
      return [];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!settings.isTestMode && !daySettings?.isOpen) {
      console.log('Day is closed or no settings found for this day');
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