import { useBookingSettings } from "./useBookingSettings";
import { useAvailableSlots } from "./useAvailableSlots";
import { startOfDay, isBefore, isAfter } from "date-fns";
import { supabase } from "@/lib/supabase";

export const useBookingDates = () => {
  const { settings, minDate, maxDate, isTestMode } = useBookingSettings();
  const { getAvailableSlots } = useAvailableSlots();

  const isDayExcluded = (date: Date) => {
    if (!settings) {
      console.log('❌ Paramètres non disponibles');
      return true;
    }
    
    const dateToCheck = startOfDay(date);
    
    // En mode test, tous les jours sont disponibles
    if (isTestMode) {
      return false;
    }
    
    // Vérifier si la date est dans la plage autorisée
    if (isBefore(dateToCheck, minDate) || isAfter(dateToCheck, maxDate)) {
      console.log('❌ Date hors plage:', dateToCheck);
      return true;
    }

    // Vérifier si le jour est fermé (lundi = 1, mardi = 2)
    const dayOfWeek = dateToCheck.getDay();
    if (dayOfWeek === 1 || dayOfWeek === 2) {
      console.log('❌ Jour fermé (lundi ou mardi):', dayOfWeek);
      return true;
    }

    // Vérifier si la date est spécifiquement exclue
    if (settings.excludedDays?.includes(dateToCheck.getTime())) {
      console.log('❌ Date exclue spécifiquement:', dateToCheck);
      return true;
    }

    console.log('✅ Jour disponible:', dateToCheck);
    return false;
  };

  const getAvailableHoursForSlot = async (date: Date, timeSlot: string) => {
    if (!settings?.openingHours) return 0;

    if (isTestMode) {
      return 4;
    }

    // Vérifier si c'est un lundi ou mardi
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 1 || dayOfWeek === 2) {
      return 0;
    }

    const slots = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
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

      if (error) throw error;

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
      console.error('❌ Erreur calcul heures disponibles:', error);
      return maxPossibleHours;
    }
  };

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots: (date: Date) => {
      // Vérifier si c'est un lundi ou mardi
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 1 || dayOfWeek === 2) {
        return Promise.resolve([]);
      }
      
      // Retourner les créneaux standards pour les autres jours
      return Promise.resolve(['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']);
    },
    getAvailableHoursForSlot,
    isTestMode
  };
};