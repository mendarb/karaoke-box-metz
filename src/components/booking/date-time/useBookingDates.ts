import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay, isBefore, isAfter } from "date-fns";

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

  const today = startOfDay(new Date());
  const isTestMode = import.meta.env.VITE_STRIPE_MODE === 'test';
  
  // Calculate min and max dates based on settings
  const minDate = isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  const isDayExcluded = (date: Date) => {
    if (!settings) return true;
    
    const dateToCheck = startOfDay(date);
    
    // In test mode, all days are available
    if (isTestMode) {
      return false;
    }
    
    // Check if date is within allowed range
    if (isBefore(dateToCheck, minDate) || isAfter(dateToCheck, maxDate)) {
      return true;
    }

    // Check if day is open
    const dayOfWeek = dateToCheck.getDay().toString();
    const daySettings = settings.openingHours?.[dayOfWeek];
    
    if (!daySettings?.isOpen) {
      return true;
    }

    // Check if date is excluded
    if (settings.excludedDays?.includes(dateToCheck.getTime())) {
      return true;
    }

    return false;
  };

  const getAvailableSlots = async (date: Date) => {
    if (!settings?.openingHours) {
      return [];
    }

    // In test mode, return all possible slots
    if (isTestMode) {
      return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      return [];
    }

    const slots = daySettings.slots || [];

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        throw error;
      }

      return slots.filter(slot => {
        const slotTime = parseInt(slot.split(':')[0]);
        return !bookings?.some(booking => {
          const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
          const bookingDuration = parseInt(booking.duration);
          return slotTime >= bookingStartTime && slotTime < (bookingStartTime + bookingDuration);
        });
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return slots;
    }
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    if (!settings?.openingHours) return 0;

    // In test mode, always return 4 hours
    if (isTestMode) {
      return 4;
    }

    const daySettings = settings.openingHours[date.getDay().toString()];
    if (!daySettings?.isOpen || !daySettings.slots) {
      return 0;
    }

    const slots = daySettings.slots;
    const slotIndex = slots.indexOf(timeSlot);
    if (slotIndex === -1) {
      return 0;
    }

    if (slotIndex === slots.length - 1) {
      return 1;
    }

    const remainingSlots = slots.length - slotIndex - 1;
    const maxPossibleHours = Math.min(4, remainingSlots + 1);

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        throw error;
      }

      if (!bookings?.length) {
        return maxPossibleHours;
      }

      const slotTime = parseInt(timeSlot.split(':')[0]);
      let availableHours = maxPossibleHours;

      bookings.forEach(booking => {
        const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
        if (bookingStartTime > slotTime) {
          availableHours = Math.min(availableHours, bookingStartTime - slotTime);
        }
      });

      return availableHours;
    } catch (error) {
      console.error('Error calculating available hours:', error);
      return maxPossibleHours;
    }
  };

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots,
    getAvailableHoursForSlot,
    isTestMode
  };
};