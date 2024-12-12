import { startOfDay, addDays, isBefore, isAfter } from "date-fns";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const getDateBoundaries = (settings: BookingSettings | undefined) => {
  const today = startOfDay(new Date());
  
  // Always apply the minimum days setting, even in test mode
  const minDays = settings?.bookingWindow?.startDays || 1;
  const minDate = addDays(today, minDays);
    
  const maxDays = settings?.isTestMode ? 365 : (settings?.bookingWindow?.endDays || 30);
  const maxDate = addDays(today, maxDays);

  console.log('Date boundaries:', { 
    minDate, 
    maxDate, 
    isTestMode: settings?.isTestMode,
    startDays: minDays,
    endDays: maxDays,
    today
  });

  return { minDate, maxDate };
};

export const isDateExcluded = (
  date: Date, 
  settings: BookingSettings | undefined, 
  minDate: Date, 
  maxDate: Date
) => {
  if (!settings) return true;
  
  const dateToCheck = startOfDay(date);
  
  // Always check minimum date boundary, even in test mode
  if (isBefore(dateToCheck, minDate)) {
    console.log('Date before minimum allowed:', {
      date: dateToCheck,
      minDate,
      startDays: settings.bookingWindow?.startDays
    });
    return true;
  }

  // Check maximum date boundary
  if (isAfter(dateToCheck, maxDate)) {
    console.log('Date after maximum allowed:', {
      date: dateToCheck,
      maxDate,
      endDays: settings.bookingWindow?.endDays
    });
    return true;
  }

  // Check if the day is open
  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    console.log('Day is closed:', { date: dateToCheck, dayOfWeek });
    return true;
  }

  // Check if the date is excluded
  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('Date is excluded:', dateToCheck);
    return true;
  }

  return false;
};