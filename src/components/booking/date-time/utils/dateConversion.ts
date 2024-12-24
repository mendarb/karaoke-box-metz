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

export const convertJsWeekDayToSettings = (jsWeekDay: number): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const settingsWeekDay = ((jsWeekDay + 6) % 7) + 1;
  return String(settingsWeekDay);
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
  
  // En mode test, aucun jour n'est exclu
  if (isTestMode) {
    return false;
  }
  
  // Vérifier si la date est dans la plage autorisée
  if (dateToCheck < minDate || dateToCheck > maxDate) {
    console.log('Date hors plage:', date);
    return true;
  }

  // Convertir le jour de la semaine au format des settings
  const settingsWeekDay = convertJsWeekDayToSettings(dateToCheck.getDay());
  const daySettings = settings.openingHours?.[settingsWeekDay];
  
  // Vérifier si le jour est ouvert
  if (!daySettings?.isOpen) {
    console.log('Jour fermé:', date, 'jour:', settingsWeekDay, 'settings:', settings.openingHours);
    return true;
  }

  // Vérifier si le jour est dans la liste des jours exclus
  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('Jour exclu:', date);
    return true;
  }

  return false;
};