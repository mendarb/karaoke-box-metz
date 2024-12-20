import { startOfDay, isBefore, isAfter } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";
import { toast } from "@/hooks/use-toast";

export const validateDate = (
  date: Date,
  settings: BookingSettings | null | undefined,
  minDate: Date,
  maxDate: Date
): { isValid: boolean; error?: string } => {
  if (!settings) {
    return { 
      isValid: false, 
      error: "Les paramètres de réservation ne sont pas disponibles" 
    };
  }
  
  const dateToCheck = startOfDay(date);
  
  if (isBefore(dateToCheck, minDate)) {
    return { 
      isValid: false, 
      error: "La date sélectionnée est trop proche. Veuillez choisir une date plus éloignée." 
    };
  }

  if (isAfter(dateToCheck, maxDate)) {
    return { 
      isValid: false, 
      error: "La date sélectionnée est trop éloignée. Veuillez choisir une date plus proche." 
    };
  }

  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    return { 
      isValid: false, 
      error: "Nous sommes fermés ce jour-là" 
    };
  }

  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    return { 
      isValid: false, 
      error: "Cette date n'est pas disponible à la réservation" 
    };
  }

  return { isValid: true };
};

export const showDateValidationError = (error: string) => {
  toast({
    title: "Date non disponible",
    description: error,
    variant: "destructive",
  });
};