import { startOfDay, addDays } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const getDateRange = (settings: BookingSettings | null | undefined, isTestMode: boolean) => {
  const today = startOfDay(new Date());
  
  const minDate = isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  return { minDate, maxDate };
};

export const convertJsWeekDayToSettings = (jsWeekDay: number): number => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  // Pour convertir:
  // JS      -> Notre format
  // 0 (dim) -> 7
  // 1 (lun) -> 1
  // 2 (mar) -> 2
  // etc...
  return jsWeekDay === 0 ? 7 : jsWeekDay;
};

export const isDayExcluded = (
  date: Date, 
  settings: BookingSettings | null | undefined,
  minDate: Date,
  maxDate: Date,
  isTestMode: boolean
): boolean => {
  if (!settings) return true;
  
  const dateToCheck = startOfDay(date);
  
  if (isTestMode) {
    return false;
  }
  
  if (dateToCheck < minDate || dateToCheck > maxDate) {
    return true;
  }

  const jsWeekDay = dateToCheck.getDay();
  const settingsWeekDay = convertJsWeekDayToSettings(jsWeekDay);
  
  console.log('Vérification jour:', { 
    date: dateToCheck.toISOString(), 
    jsWeekDay,
    settingsWeekDay,
    openingHours: settings.openingHours
  });

  const daySettings = settings.openingHours?.[settingsWeekDay];
  
  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', { 
      date: dateToCheck.toISOString(), 
      jsWeekDay,
      settingsWeekDay,
      isOpen: daySettings?.isOpen
    });
    return true;
  }

  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    return true;
  }

  return false;
};