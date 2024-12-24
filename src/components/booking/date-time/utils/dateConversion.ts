import { addDays, startOfDay, isBefore, isAfter, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const convertJsWeekDayToSettings = (jsWeekDay: number): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const settingsWeekDay = jsWeekDay === 0 ? 7 : jsWeekDay;
  
  console.log('🔄 Conversion jour:', { 
    jsWeekDay, 
    settingsWeekDay,
    jsDay: getDayName(jsWeekDay),
    settingsDay: getDayName(jsWeekDay)
  });
  
  return String(settingsWeekDay);
};

const getDayName = (jsWeekDay: number): string => {
  const days = {
    0: 'Dimanche',
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi'
  };
  return days[jsWeekDay as keyof typeof days];
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
    console.log('❌ Pas de paramètres d\'horaires');
    return true;
  }

  // Convertir la date UTC en date locale
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = typeof date === 'string' ? utcToZonedTime(parseISO(date), timezone) : utcToZonedTime(date, timezone);
  
  // S'assurer que nous sommes au début du jour
  const dayStart = startOfDay(localDate);
  
  // Obtenir le jour de la semaine en local
  const dayOfWeek = dayStart.getDay();
  const settingsWeekDay = convertJsWeekDayToSettings(dayOfWeek);
  const daySettings = settings.openingHours[settingsWeekDay];

  console.log('📅 Vérification jour:', {
    date: date.toISOString(),
    localDate: localDate.toLocaleString(),
    dayOfWeek,
    settingsWeekDay,
    daySettings,
    isOpen: daySettings?.isOpen
  });

  if (!daySettings?.isOpen) {
    return true;
  }

  return false;
};