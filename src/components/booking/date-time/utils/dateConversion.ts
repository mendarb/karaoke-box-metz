import { startOfDay, isEqual } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const convertJsWeekDayToSettings = (date: Date): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const jsWeekDay = date.getDay();
  return String(jsWeekDay === 0 ? 7 : jsWeekDay);
};

export const isDayExcluded = (date: Date, settings: BookingSettings | null | undefined): boolean => {
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return true;
  }

  const normalizedDate = startOfDay(date);
  
  // Vérifier si le jour est dans la fenêtre de réservation
  if (settings.bookingWindow) {
    const startDate = startOfDay(new Date(settings.bookingWindow.startDate));
    const endDate = startOfDay(new Date(settings.bookingWindow.endDate));
    
    if (normalizedDate < startDate || normalizedDate > endDate) {
      console.log('❌ Jour hors fenêtre de réservation:', {
        date: normalizedDate,
        startDate,
        endDate
      });
      return true;
    }
  }

  // Vérifier si le jour est ouvert selon les horaires
  const settingsWeekDay = convertJsWeekDayToSettings(normalizedDate);
  const daySettings = settings.openingHours[settingsWeekDay];

  if (!daySettings?.isOpen || !daySettings.slots.length) {
    console.log('❌ Jour fermé ou sans créneaux:', {
      date: normalizedDate.toISOString(),
      settingsWeekDay,
      isOpen: daySettings?.isOpen,
      slots: daySettings?.slots
    });
    return true;
  }

  // Vérifier si le jour est exclu manuellement
  if (settings.excludedDays?.some(excludedDay => 
    isEqual(startOfDay(new Date(excludedDay)), normalizedDate)
  )) {
    console.log('❌ Jour exclu manuellement:', normalizedDate.toISOString());
    return true;
  }

  return false;
};