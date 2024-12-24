import { startOfDay, isEqual } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

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

  // Vérifier si le jour est exclu manuellement
  if (settings.excludedDays?.some(excludedDay => 
    isEqual(startOfDay(new Date(excludedDay)), normalizedDate)
  )) {
    console.log('❌ Jour exclu manuellement:', normalizedDate.toISOString());
    return true;
  }

  // Vérifier les horaires d'ouverture - Utiliser le jour de la semaine (0-6)
  const dayOfWeek = normalizedDate.getDay().toString();
  const daySettings = settings.openingHours[dayOfWeek];

  if (!daySettings?.isOpen || !daySettings.slots?.length) {
    console.log('❌ Jour fermé ou sans créneaux:', {
      date: normalizedDate.toISOString(),
      dayOfWeek,
      isOpen: daySettings?.isOpen,
      slots: daySettings?.slots?.length
    });
    return true;
  }

  console.log('✅ Jour disponible:', {
    date: normalizedDate.toISOString(),
    dayOfWeek,
    slots: daySettings.slots
  });
  return false;
};