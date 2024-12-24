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
  const settingsWeekDay = jsWeekDay === 0 ? 7 : jsWeekDay;
  
  console.log('🔄 Conversion jour:', { 
    jsWeekDay, 
    settingsWeekDay,
    jsDay: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][jsWeekDay],
    settingsDay: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][settingsWeekDay - 1]
  });
  
  return String(settingsWeekDay);
};

export const isDayExcluded = (
  date: Date, 
  settings: BookingSettings | null | undefined,
  minDate: Date,
  maxDate: Date,
  isTestMode: boolean
): boolean => {
  console.log('🔍 Vérification jour:', date.toISOString());
  
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return true;
  }
  
  const dateToCheck = startOfDay(date);
  const jsWeekDay = dateToCheck.getDay();
  const settingsWeekDay = convertJsWeekDayToSettings(jsWeekDay);
  const daySettings = settings.openingHours[settingsWeekDay];
  
  console.log('📅 Vérification paramètres jour:', {
    date: date.toISOString(),
    jsWeekDay,
    settingsWeekDay,
    daySettings,
    isOpen: daySettings?.isOpen
  });
  
  // En mode test, aucun jour n'est exclu
  if (isTestMode) {
    console.log('🧪 Mode test actif - jour autorisé');
    return false;
  }
  
  // Vérifier si la date est dans la plage autorisée
  if (dateToCheck < minDate || dateToCheck > maxDate) {
    console.log('📅 Date hors plage:', { date, minDate, maxDate });
    return true;
  }

  // Si le jour n'est pas configuré ou explicitement fermé, il est exclu
  if (!daySettings || !daySettings.isOpen) {
    console.log('❌ Jour non configuré ou fermé:', {
      date: date.toISOString(),
      jsWeekDay,
      settingsWeekDay,
      daySettings
    });
    return true;
  }

  console.log('✅ Jour disponible');
  return false;
};