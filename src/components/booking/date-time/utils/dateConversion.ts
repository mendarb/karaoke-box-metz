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
  
  console.log('Conversion jour:', { 
    jsWeekDay, 
    settingsWeekDay,
    jsDay: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][jsWeekDay],
    settingsDay: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][settingsWeekDay === 7 ? 6 : settingsWeekDay - 1]
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
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return false; // Par défaut, autoriser tous les jours si pas de paramètres
  }
  
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
  const jsWeekDay = dateToCheck.getDay();
  const settingsWeekDay = convertJsWeekDayToSettings(jsWeekDay);
  const daySettings = settings.openingHours[settingsWeekDay];
  
  // Si le jour n'est pas configuré, on le considère comme ouvert par défaut
  if (!daySettings) {
    console.log('Jour non configuré, considéré comme ouvert:', {
      date: date.toISOString(),
      jsWeekDay,
      settingsWeekDay
    });
    return false;
  }

  // Le jour est exclu uniquement s'il est explicitement marqué comme fermé
  const isExcluded = daySettings.isOpen === false;
  
  if (isExcluded) {
    console.log('Jour explicitement fermé:', {
      date: date.toISOString(),
      jsWeekDay,
      settingsWeekDay,
      daySettings
    });
  }

  return isExcluded;
};