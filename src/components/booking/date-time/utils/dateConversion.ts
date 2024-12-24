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
      return true;
    }
  }

  // Vérifier si le jour est exclu manuellement
  if (settings.excludedDays?.some(excludedDay => 
    isEqual(startOfDay(new Date(excludedDay)), normalizedDate)
  )) {
    return true;
  }

  // Vérifier les horaires d'ouverture
  const dayOfWeek = normalizedDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  const daySettings = settings.openingHours[dayOfWeek];

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  console.log('📅 Vérification jour:', {
    date: normalizedDate.toISOString(),
    jour: dayNames[dayOfWeek],
    indexJour: dayOfWeek,
    estOuvert: daySettings?.isOpen,
    creneaux: daySettings?.slots?.length,
    parametresJour: daySettings
  });

  // Si le jour n'est pas ouvert ou n'a pas de créneaux, il est désactivé
  if (!daySettings?.isOpen || !daySettings.slots?.length) {
    console.log('❌ Jour fermé:', {
      date: normalizedDate.toISOString(),
      jour: dayNames[dayOfWeek],
      estOuvert: daySettings?.isOpen,
      creneaux: daySettings?.slots?.length
    });
    return true;
  }

  return false;
};