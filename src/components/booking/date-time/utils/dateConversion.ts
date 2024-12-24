import { addDays, startOfDay } from "date-fns";
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
    console.log('❌ Pas de paramètres d\'horaires pour:', date.toISOString());
    return true;
  }
  
  // Utiliser startOfDay pour éviter les problèmes de décalage horaire
  const dateToCheck = startOfDay(date);
  const jsWeekDay = date.getDay();
  const settingsWeekDay = convertJsWeekDayToSettings(jsWeekDay);
  const daySettings = settings.openingHours[settingsWeekDay];
  
  console.log('📅 Vérification disponibilité:', {
    date: dateToCheck.toISOString(),
    jsWeekDay,
    settingsWeekDay,
    daySettings,
    isOpen: daySettings?.isOpen,
    slots: daySettings?.slots
  });
  
  // En mode test, aucun jour n'est exclu
  if (isTestMode) {
    return false;
  }
  
  // Vérifier si la date est dans la plage autorisée
  const minDateStart = startOfDay(minDate);
  const maxDateStart = startOfDay(maxDate);
  if (dateToCheck < minDateStart || dateToCheck > maxDateStart) {
    console.log('📅 Date hors plage:', { date: dateToCheck, minDate: minDateStart, maxDate: maxDateStart });
    return true;
  }

  // Vérifier si le jour est configuré et ouvert
  if (!daySettings?.isOpen || !daySettings?.slots?.length) {
    console.log('❌ Jour fermé ou pas de créneaux:', {
      date: dateToCheck.toISOString(),
      isOpen: daySettings?.isOpen,
      slots: daySettings?.slots
    });
    return true;
  }

  // Vérifier si le jour est dans les jours exclus
  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('❌ Jour exclu spécifiquement:', dateToCheck.toISOString());
    return true;
  }

  console.log('✅ Jour disponible:', dateToCheck.toISOString());
  return false;
};