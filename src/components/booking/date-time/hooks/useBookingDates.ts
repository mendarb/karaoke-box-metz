import { useBookingSettings } from "./useBookingSettings";
import { isDateExcluded } from "../utils/dateValidation";
import { useTimeSlots } from "./useTimeSlots";

export const useBookingDates = () => {
  const { settings, isLoading, minDate, maxDate } = useBookingSettings();
  const { getAvailableSlots, getAvailableHoursForSlot } = useTimeSlots();

  console.log('useBookingDates settings:', {
    settings,
    minDate,
    maxDate,
    isTestMode: settings?.isTestMode
  });

  const isDayExcluded = (date: Date) => {
    return isDateExcluded(date, settings, minDate, maxDate);
  };

  return {
    settings,
    isLoading,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots: (date: Date) => getAvailableSlots(date, settings),
    getAvailableHoursForSlot: (date: Date, timeSlot: string) => 
      getAvailableHoursForSlot(date, timeSlot, settings)
  };
};