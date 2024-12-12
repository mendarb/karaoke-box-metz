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

      console.log('Fetched settings:', data?.value);
      return data?.value;
    },
  });

  const today = startOfDay(new Date());
  
  // Calcul des dates min et max en fonction des paramètres
  const minDate = settings?.isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = settings?.isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  console.log('Date boundaries:', { minDate, maxDate, isTestMode: settings?.isTestMode });

  const isDayExcluded = (date: Date) => {
    if (!settings) return true;
    
    const dateToCheck = startOfDay(date);
    
    // Vérifier si la date est dans la plage autorisée
    if (isBefore(dateToCheck, minDate) || isAfter(dateToCheck, maxDate)) {
      console.log('Date outside booking window:', dateToCheck);
      return true;
    }

    // Vérifier si le jour est ouvert
    const dayOfWeek = dateToCheck.getDay().toString();
    const daySettings = settings.openingHours?.[dayOfWeek];
    
    if (!daySettings?.isOpen) {
      console.log('Day is closed:', { date: dateToCheck, dayOfWeek });
      return true;
    }

    // Vérifier si la date est exclue
    if (settings.excludedDays?.includes(dateToCheck.getTime())) {
      console.log('Date is excluded:', dateToCheck);
      return true;
    }

    return false;
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    if (!settings) return 0;

    const daySettings = settings.openingHours?.[date.getDay().toString()];
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

    // Si c'est le dernier créneau, on ne permet qu'une heure
    if (slotIndex === slots.length - 1) {
      console.log('Last slot of the day, limiting to 1 hour');
      return 1;
    }

    // Pour les autres créneaux, calculer les heures disponibles
    const remainingSlots = slots.length - slotIndex - 1;
    const maxPossibleHours = Math.min(4, remainingSlots + 1);

    // Vérifier les réservations existantes
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

    if (error) {
      console.error('Error checking bookings:', error);
      return maxPossibleHours;
    }

    console.log('Existing bookings for date:', { date, bookings });

    if (!bookings || bookings.length === 0) {
      console.log('No existing bookings, returning max hours:', maxPossibleHours);
      return maxPossibleHours;
    }

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

    if (!daySettings?.isOpen) {
      console.log('Day is closed:', { date, dayOfWeek });
      return [];
    }

    const slots = daySettings.slots || [];
    console.log('Potential slots for day:', slots);

    // Vérifier les réservations existantes pour filtrer les créneaux déjà pris
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

    console.log('Existing bookings:', bookings);

    // Filtrer les créneaux déjà réservés
    const availableSlots = slots.filter(slot => {
      const isBooked = bookings?.some(booking => {
        const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
        const bookingDuration = parseInt(booking.duration);
        const slotTime = parseInt(slot.split(':')[0]);
        
        // Vérifier si le créneau est dans la plage de la réservation
        return slotTime >= bookingStartTime && slotTime < (bookingStartTime + bookingDuration);
      });
      
      if (isBooked) {
        console.log('Slot is booked:', slot);
      }
      return !isBooked;
    });

    console.log('Available slots after filtering:', availableSlots);
    return availableSlots;
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