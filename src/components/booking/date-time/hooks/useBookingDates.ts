import { useBookingSettings } from "./useBookingSettings";
import { validateDate } from "../utils/dateValidation";
import { getAvailableSlots, calculateAvailableHours } from "../utils/slotUtils";

export const useBookingDates = () => {
  const { settings, isLoading, error, minDate, maxDate } = useBookingSettings();

  const isDayExcluded = (date: Date) => {
    console.log('🔍 Vérification de la disponibilité de la date:', {
      date,
      settings,
      isTestMode: settings?.isTestMode,
      minDate,
      maxDate
    });

    // En mode test, aucun jour n'est exclu
    if (settings?.isTestMode) {
      console.log('✅ Mode test: tous les jours sont disponibles');
      return false;
    }

    const validation = validateDate(date, settings, minDate, maxDate);
    if (!validation.isValid) {
      console.log('❌ Date non valide:', validation.error);
    }
    
    return !validation.isValid;
  };

  return {
    settings,
    isLoading,
    error,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots: (date: Date) => getAvailableSlots(date, settings),
    getAvailableHoursForSlot: (date: Date, timeSlot: string) => 
      calculateAvailableHours(date, timeSlot, settings)
  };
};