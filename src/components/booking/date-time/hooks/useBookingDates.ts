import { useBookingSettings } from "./useBookingSettings";
import { validateDate, showDateValidationError } from "../utils/dateValidation";
import { getAvailableSlots, calculateAvailableHours } from "../utils/slotUtils";

export const useBookingDates = () => {
  const { settings, isLoading, minDate, maxDate } = useBookingSettings();

  const isDayExcluded = (date: Date) => {
    console.log('Checking date:', date, 'Settings:', settings);
    const validation = validateDate(date, settings, minDate, maxDate);
    
    if (!validation.isValid && validation.error) {
      showDateValidationError(validation.error);
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