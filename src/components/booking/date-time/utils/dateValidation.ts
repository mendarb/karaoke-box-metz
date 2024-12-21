import { startOfDay, isBefore, isAfter } from "date-fns";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";
import { toast } from "@/hooks/use-toast";

/**
 * Validates if a given date is valid for booking based on settings
 * @param date The date to validate
 * @param settings Booking settings configuration
 * @param minDate Minimum allowed date
 * @param maxDate Maximum allowed date
 * @returns Object containing validation result and error message if invalid
 */
export const validateDate = (
  date: Date,
  settings: BookingSettings | null | undefined,
  minDate: Date,
  maxDate: Date
): { isValid: boolean; error?: string } => {
  console.log('🔍 Validating date:', {
    date,
    settings,
    minDate,
    maxDate,
    isTestMode: settings?.isTestMode
  });
  
  if (!settings) {
    console.log('❌ Settings not available');
    return { 
      isValid: false, 
      error: "Les paramètres de réservation ne sont pas disponibles" 
    };
  }

  // En mode test, on ignore toutes les validations
  if (settings.isTestMode) {
    console.log('✅ Test mode: bypassing date validation');
    return { isValid: true };
  }
  
  const dateToCheck = startOfDay(date);
  
  if (isBefore(dateToCheck, minDate)) {
    console.log('❌ Date too close:', { date: dateToCheck, minDate });
    return { 
      isValid: false, 
      error: "La date sélectionnée est trop proche. Veuillez choisir une date plus éloignée." 
    };
  }

  if (isAfter(dateToCheck, maxDate)) {
    console.log('❌ Date too far:', { date: dateToCheck, maxDate });
    return { 
      isValid: false, 
      error: "La date sélectionnée est trop éloignée. Veuillez choisir une date plus proche." 
    };
  }

  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    console.log('❌ Day is closed:', { date: dateToCheck, dayOfWeek, settings });
    return { 
      isValid: false, 
      error: "Nous sommes fermés ce jour-là" 
    };
  }

  if (settings.excludedDays?.includes(dateToCheck.getTime())) {
    console.log('❌ Date is excluded:', dateToCheck);
    return { 
      isValid: false, 
      error: "Cette date n'est pas disponible à la réservation" 
    };
  }

  console.log('✅ Date is valid:', dateToCheck);
  return { isValid: true };
};

export const showDateValidationError = (error: string) => {
  console.log('🚨 Showing date validation error:', error);
  toast({
    title: "Date non disponible",
    description: error,
    variant: "destructive",
  });
};