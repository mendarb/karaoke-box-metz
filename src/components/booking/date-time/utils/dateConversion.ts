import { addDays, startOfDay, isBefore, isAfter, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const convertJsWeekDayToSettings = (jsWeekDay: number): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
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
  if (!settings?.openingHours) {
    return true;
  }

  const normalizedDate = startOfDay(date);
  const dayOfWeek = normalizedDate.getDay();
  const settingsWeekDay = convertJsWeekDayToSettings(dayOfWeek);
  const daySettings = settings.openingHours[settingsWeekDay];

  return !daySettings?.isOpen;
};