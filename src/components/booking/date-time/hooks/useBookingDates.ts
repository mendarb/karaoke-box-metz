import { useBookingSettings } from "./useBookingSettings";
import { validateDate, showDateValidationError } from "../utils/dateValidation";
import { getAvailableSlots, calculateAvailableHours } from "../utils/slotUtils";

/**
 * Hook to manage booking dates, validation, and availability
 * @returns Object containing date-related utilities and validation functions
 */
export const useBookingDates = () => {
  const { settings, isLoading, minDate, maxDate } = useBookingSettings();

  const isDayExcluded = (date: Date) => {
    console.log('🔍 Checking date availability:', {
      date,
      settings,
      isTestMode: settings?.isTestMode,
      minDate,
      maxDate
    });

    // En mode test, aucun jour n'est exclu
    if (settings?.isTestMode) {
      console.log('✅ Test mode: all dates are available');
      return false;
    }

    const validation = validateDate(date, settings, minDate, maxDate);
    
    if (!validation.isValid && validation.error) {
      console.log('❌ Date validation failed:', validation.error);
      showDateValidationError(validation.error);
    } else {
      console.log('✅ Date validation passed');
    }
    
    return !validation.isValid;
  };

  return {
    settings,
    isLoading,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots: (date: Date) => getAvailableSlots(date, settings),
    getAvailableHoursForSlot: (date: Date, timeSlot: string) => 
      calculateAvailableHours(date, timeSlot, settings)
  };
};