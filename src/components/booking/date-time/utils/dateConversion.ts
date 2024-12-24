import { startOfDay, isEqual } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const isDayExcluded = (date: Date, settings: BookingSettings | null | undefined): boolean => {
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return true;
  }

  // Important: Utiliser getDay() directement sur la date locale
  const dayOfWeek = date.getDay();
  const daySettings = settings.openingHours[dayOfWeek];

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  console.log('📅 Vérification jour:', {
    date: date.toISOString(),
    jour: dayNames[dayOfWeek],
    indexJour: dayOfWeek,
    estOuvert: daySettings?.isOpen,
    creneaux: daySettings?.slots?.length,
    parametresJour: daySettings
  });

  // Si le jour n'est pas ouvert ou n'a pas de créneaux, il est désactivé
  if (!daySettings?.isOpen || !daySettings.slots?.length) {
    console.log('❌ Jour fermé:', {
      date: date.toISOString(),
      jour: dayNames[dayOfWeek],
      estOuvert: daySettings?.isOpen,
      creneaux: daySettings?.slots?.length
    });
    return true;
  }

  // Vérifier si le jour est exclu manuellement
  if (settings.excludedDays?.some(excludedDay => 
    isEqual(startOfDay(new Date(excludedDay)), startOfDay(date))
  )) {
    return true;
  }

  return false;
};