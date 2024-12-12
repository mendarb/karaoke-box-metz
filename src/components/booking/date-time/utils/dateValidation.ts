import { startOfDay, addDays, isBefore, isAfter } from "date-fns";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const getDateBoundaries = (settings: BookingSettings | undefined) => {
  const today = startOfDay(new Date());
  
  const minDate = settings?.isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = settings?.isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  console.log('Date boundaries:', { 
    minDate, 
    maxDate, 
    isTestMode: settings?.isTestMode,
    startDays: settings?.bookingWindow?.startDays,
    endDays: settings?.bookingWindow?.endDays
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
  
  // Vérifier si la date est dans la plage autorisée
  if (isBefore(dateToCheck, minDate) || isAfter(dateToCheck, maxDate)) {
    console.log('Date outside booking window:', {
      date: dateToCheck,
      minDate,
      maxDate,
      beforeMin: isBefore(dateToCheck, minDate),
      afterMax: isAfter(dateToCheck, maxDate)
    });
    return true;
  }

  // Vérifier si le jour est ouvert
  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    console.log('Day is closed:', { date: dateToCheck, dayOfWeek });
    return true;
  }

  // Vérifier si la date est exclue
  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('Date is excluded:', dateToCheck);
    return true;
  }

  return false;
};