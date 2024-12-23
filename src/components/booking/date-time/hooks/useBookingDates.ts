import { useBookingSettings } from "./useBookingSettings";
import { useAvailableSlots } from "./useAvailableSlots";
import { startOfDay, isBefore, isAfter } from "date-fns";

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

    // Vérifier les paramètres d'ouverture du jour
    const daySettings = settings.openingHours?.[dayOfWeek.toString()];
    if (!daySettings?.isOpen) {
      console.log('❌ Jour fermé selon paramètres:', dayOfWeek);
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
    getAvailableSlots,
    getAvailableHoursForSlot,
    isTestMode
  };
};