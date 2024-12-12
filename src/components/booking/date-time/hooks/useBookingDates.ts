import { useBookingSettings } from "./useBookingSettings";
import { getDateBoundaries, isDateExcluded } from "../utils/dateValidation";
import { useTimeSlots } from "./useTimeSlots";

export const useBookingDates = () => {
  const { data: settings } = useBookingSettings();
  const { getAvailableSlots, getAvailableHoursForSlot } = useTimeSlots();
  const { minDate, maxDate } = getDateBoundaries(settings);

  const isDayExcluded = (date: Date) => {
    return isDateExcluded(date, settings, minDate, maxDate);
  };

  return {
    settings,
    minDate,
    maxDate,
    isDayExcluded,
    getAvailableSlots: (date: Date) => getAvailableSlots(date, settings),
    getAvailableHoursForSlot: (date: Date, timeSlot: string) => 
      getAvailableHoursForSlot(date, timeSlot, settings)
  };
};