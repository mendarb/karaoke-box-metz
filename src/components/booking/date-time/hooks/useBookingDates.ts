import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay, isBefore, isAfter } from "date-fns";

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

      console.log('Booking settings loaded:', data?.value);
      return data?.value;
    },
  });

  const isTestMode = import.meta.env.VITE_STRIPE_MODE === 'test';
  
  // Calculate min and max dates based on settings
  const minDate = settings?.bookingWindow?.startDate 
    ? new Date(settings.bookingWindow.startDate)
    : addDays(startOfDay(new Date()), 1);
    
  const maxDate = settings?.bookingWindow?.endDate
    ? new Date(settings.bookingWindow.endDate)
    : addDays(startOfDay(new Date()), 30);

  const isDayExcluded = (date: Date) => {
    if (!settings) {
      console.log('Settings not available, excluding day:', date);
      return true;
    }
    
    const dateToCheck = startOfDay(date);
    
    // En mode test, tous les jours sont disponibles
    if (isTestMode) {
      console.log('Test mode: all days available');
      return false;
    }
    
    // Vérifier si la date est dans la plage autorisée
    if (isBefore(dateToCheck, minDate) || isAfter(dateToCheck, maxDate)) {
      console.log('Date outside allowed range:', date);
      return true;
    }

    // Vérifier si le jour est ouvert selon les paramètres
    const dayOfWeek = dateToCheck.getDay().toString();
    const daySettings = settings.openingHours?.[dayOfWeek];
    
    if (!daySettings?.isOpen) {
      console.log('Day is closed according to settings:', {
        date,
        dayOfWeek,
        settings: daySettings
      });
      return true;
    }

    // Vérifier si la date est exclue spécifiquement
    if (settings.excludedDays?.includes(dateToCheck.getTime())) {
      console.log('Date is specifically excluded:', date);
      return true;
    }

    console.log('Day is available:', date);
    return false;
  };

  const getAvailableSlots = async (date: Date) => {
    console.log('Getting available slots for date:', date);
    
    if (!settings?.openingHours) {
      console.log('No opening hours settings found');
      return [];
    }

    // En mode test, retourner tous les créneaux possibles
    if (isTestMode) {
      console.log('Test mode: returning all possible slots');
      return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('Day is closed:', { date, dayOfWeek });
      return [];
    }

    const slots = daySettings.slots || [];
    console.log('Available slots for day:', slots);

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking bookings:', error);
        return slots;
      }

      const availableSlots = slots.filter(slot => {
        const slotTime = parseInt(slot.split(':')[0]);
        
        const isBooked = bookings?.some(booking => {
          const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
          const bookingDuration = parseInt(booking.duration);
          
          return slotTime >= bookingStartTime && slotTime < (bookingStartTime + bookingDuration);
        });
        
        if (isBooked) {
          console.log('Slot is booked:', slot);
        }
        return !isBooked;
      });

      console.log('Final available slots:', availableSlots);
      return availableSlots;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return slots;
    }
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    console.log('Calculating available hours for:', { date, timeSlot });
    
    if (!settings?.openingHours) {
      console.log('No opening hours settings');
      return 0;
    }

    // En mode test, toujours retourner 4 heures
    if (isTestMode) {
      console.log('Test mode: returning maximum hours (4)');
      return 4;
    }

    const daySettings = settings.openingHours[date.getDay().toString()];
    if (!daySettings?.isOpen || !daySettings.slots) {
      console.log('Day is closed or no slots available');
      return 0;
    }

    const slots = daySettings.slots;
    const slotIndex = slots.indexOf(timeSlot);
    if (slotIndex === -1) {
      console.log('Invalid time slot:', timeSlot);
      return 0;
    }

    if (slotIndex === slots.length - 1) {
      console.log('Last slot of the day, limiting to 1 hour');
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
        console.log('No existing bookings, returning max hours:', maxPossibleHours);
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

      console.log('Available hours calculated:', {
        slot: timeSlot,
        availableHours,
        maxPossibleHours
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