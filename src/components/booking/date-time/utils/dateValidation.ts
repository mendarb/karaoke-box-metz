import { startOfDay, isBefore, isAfter } from "date-fns";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const isDateExcluded = (
  date: Date, 
  settings: BookingSettings | undefined, 
  minDate: Date, 
  maxDate: Date
) => {
  if (!settings) return true;
  
  const dateToCheck = startOfDay(date);
  
  if (isBefore(dateToCheck, minDate)) {
    console.log('Date before minimum allowed:', {
      date: dateToCheck,
      minDate,
    });
    return true;
  }

  if (isAfter(dateToCheck, maxDate)) {
    console.log('Date after maximum allowed:', {
      date: dateToCheck,
      maxDate,
    });
    return true;
  }

  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    console.log('Day is closed:', { date: dateToCheck, dayOfWeek });
    return true;
  }

  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('Date is excluded:', dateToCheck);
    return true;
  }

  return false;
};