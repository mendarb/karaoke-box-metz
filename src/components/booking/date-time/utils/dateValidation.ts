import { startOfDay, addDays, isBefore, isAfter } from "date-fns";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const getDateBoundaries = (settings: BookingSettings | undefined) => {
  const today = startOfDay(new Date());
  
  // En mode test, on permet de réserver dès aujourd'hui
  const minDays = settings?.isTestMode ? 0 : (settings?.bookingWindow?.startDays || 1);
  const minDate = addDays(today, minDays);
    
  // Max days peut être étendu en mode test
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
  
  // Toujours appliquer la limite minimale, même en mode test
  if (isBefore(dateToCheck, minDate)) {
    console.log('Date before minimum allowed:', {
      date: dateToCheck,
      minDate,
      isTestMode: settings.isTestMode,
      startDays: settings.bookingWindow?.startDays
    });
    return true;
  }

  // Vérifier la limite maximale
  if (isAfter(dateToCheck, maxDate)) {
    console.log('Date after maximum allowed:', {
      date: dateToCheck,
      maxDate,
      isTestMode: settings.isTestMode,
      endDays: settings.bookingWindow?.endDays
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