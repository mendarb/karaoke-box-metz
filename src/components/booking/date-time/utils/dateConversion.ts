import { startOfDay, addDays } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const convertJsWeekDayToSettings = (date: Date): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const jsWeekDay = date.getDay();
  return String(jsWeekDay === 0 ? 7 : jsWeekDay);
};

export const isDayExcluded = (date: Date, settings: BookingSettings | null | undefined): boolean => {
  if (!settings?.openingHours) return true;

  const normalizedDate = startOfDay(date);
  const settingsWeekDay = convertJsWeekDayToSettings(normalizedDate);
  const daySettings = settings.openingHours[settingsWeekDay];

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', {
      date: normalizedDate.toISOString(),
      settingsWeekDay,
      isOpen: daySettings?.isOpen
    });
    return true;
  }

  // Vérifier si le jour est exclu manuellement
  if (settings.excludedDays?.includes(normalizedDate.getTime())) {
    console.log('❌ Jour exclu manuellement:', normalizedDate.toISOString());
    return true;
  }

  return false;
};

export const getDateRange = (
  settings: BookingSettings | null | undefined,
  isTestMode: boolean
): { minDate: Date; maxDate: Date } => {
  const today = startOfDay(new Date());
  
  // En mode test, on permet les réservations à partir d'aujourd'hui jusqu'à un an
  if (isTestMode) {
    return {
      minDate: today,
      maxDate: addDays(today, 365)
    };
  }

  // En mode production, on utilise les paramètres de la fenêtre de réservation
  const startDays = settings?.bookingWindow?.startDays || 1;
  const endDays = settings?.bookingWindow?.endDays || 30;

  return {
    minDate: addDays(today, startDays),
    maxDate: addDays(today, endDays)
  };
};