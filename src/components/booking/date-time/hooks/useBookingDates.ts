import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay, endOfDay, isBefore, isAfter, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";

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
  const isTestMode = settings?.isTestMode || false;
  
  // Convertir les dates de la fenêtre de réservation en objets Date
  const bookingStartDate = settings?.bookingWindow?.startDate 
    ? startOfDay(parseISO(settings.bookingWindow.startDate))
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const bookingEndDate = settings?.bookingWindow?.endDate
    ? endOfDay(parseISO(settings.bookingWindow.endDate))
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  console.log('Dates de réservation:', {
    isTestMode,
    bookingStartDate,
    bookingEndDate,
    settings: settings?.bookingWindow
  });

  const isDayExcluded = (date: Date) => {
    if (!settings) {
      console.log('Paramètres non disponibles');
      return true;
    }
    
    const dateToCheck = startOfDay(date);
    
    // En mode test, toutes les dates sont disponibles
    if (isTestMode) {
      return false;
    }
    
    // Vérifier si la date est dans la fenêtre de réservation
    if (isBefore(dateToCheck, bookingStartDate)) {
      console.log('Date trop tôt:', dateToCheck, bookingStartDate);
      return true;
    }

    if (isAfter(dateToCheck, bookingEndDate)) {
      console.log('Date trop tard:', dateToCheck, bookingEndDate);
      return true;
    }

    // Vérifier si le jour est ouvert
    const dayOfWeek = dateToCheck.getDay().toString();
    const daySettings = settings.openingHours?.[dayOfWeek];
    
    if (!daySettings?.isOpen) {
      console.log('Jour fermé:', dayOfWeek);
      return true;
    }

    // Vérifier si la date est exclue
    if (settings.excludedDays?.includes(dateToCheck.getTime())) {
      console.log('Date exclue:', dateToCheck);
      return true;
    }

    return false;
  };

  const getAvailableSlots = async (date: Date) => {
    if (!settings?.openingHours) {
      console.log('Horaires non disponibles');
      return [];
    }

    // En mode test, retourner tous les créneaux possibles
    if (isTestMode) {
      return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('Jour fermé:', date, dayOfWeek);
      return [];
    }

    const slots = daySettings.slots || [];
    console.log('Créneaux potentiels:', slots);

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Erreur lors de la vérification des réservations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier les disponibilités",
          variant: "destructive",
        });
        return [];
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
      console.error('Erreur lors de la récupération des créneaux:', error);
      return slots;
    }
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    if (!settings?.openingHours) return 0;

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
      console.error('Erreur lors du calcul des heures disponibles:', error);
      return maxPossibleHours;
    }
  };

  return {
    settings,
    minDate: bookingStartDate,
    maxDate: bookingEndDate,
    isDayExcluded,
    getAvailableSlots,
    getAvailableHoursForSlot,
    isTestMode
  };
};