import { startOfDay, isBefore, isAfter } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const validateDate = (
  date: Date,
  settings: BookingSettings | null | undefined,
  minDate: Date,
  maxDate: Date
): { isValid: boolean; error?: string } => {
  console.log('🔍 Validation de la date:', {
    date,
    settings,
    minDate,
    maxDate,
    isTestMode: settings?.isTestMode
  });
  
  if (!settings) {
    console.log('❌ Paramètres non disponibles');
    return { 
      isValid: false, 
      error: "Les paramètres de réservation ne sont pas disponibles" 
    };
  }

  // En mode test, on ignore toutes les validations
  if (settings.isTestMode) {
    console.log('✅ Mode test: validation de date ignorée');
    return { isValid: true };
  }
  
  const dateToCheck = startOfDay(date);
  
  if (isBefore(dateToCheck, minDate)) {
    console.log('❌ Date trop proche:', { date: dateToCheck, minDate });
    return { 
      isValid: false, 
      error: "La date sélectionnée est trop proche. Veuillez choisir une date plus éloignée." 
    };
  }

  if (isAfter(dateToCheck, maxDate)) {
    console.log('❌ Date trop éloignée:', { date: dateToCheck, maxDate });
    return { 
      isValid: false, 
      error: "La date sélectionnée est trop éloignée. Veuillez choisir une date plus proche." 
    };
  }

  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', { date: dateToCheck, dayOfWeek });
    return { 
      isValid: false, 
      error: "Nous sommes fermés ce jour-là" 
    };
  }

  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('❌ Date exclue:', dateToCheck);
    return { 
      isValid: false, 
      error: "Cette date n'est pas disponible à la réservation" 
    };
  }

  console.log('✅ Date valide:', dateToCheck);
  return { isValid: true };
};

export const showDateValidationError = (error: string) => {
  console.log('🚨 Affichage de l\'erreur de validation:', error);
  toast({
    title: "Date non disponible",
    description: error,
    variant: "destructive",
  });
};