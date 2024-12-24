import { addDays, startOfDay, isBefore, isAfter } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const convertJsWeekDayToSettings = (date: Date): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const jsWeekDay = date.getDay();
  return String(jsWeekDay === 0 ? 7 : jsWeekDay);
};

export const getDateRange = (settings: any, isTestMode: boolean) => {
  const today = startOfDay(new Date());
  
  const minDate = isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  return { minDate, maxDate };
};

export const isDayExcluded = (date: Date, settings: BookingSettings | null | undefined): boolean => {
  if (!settings?.openingHours) return true;

  const normalizedDate = startOfDay(date);
  const settingsWeekDay = convertJsWeekDayToSettings(normalizedDate);
  const daySettings = settings.openingHours[settingsWeekDay];

  if (!daySettings?.isOpen) return true;

  // Vérifier si le jour est exclu manuellement
  if (settings.excludedDays?.includes(normalizedDate.getTime())) return true;

  return false;
};