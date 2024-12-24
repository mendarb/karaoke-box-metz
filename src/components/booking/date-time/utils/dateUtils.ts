import { addDays, startOfDay, isBefore, isAfter } from "date-fns";
import { BookingDateConfig } from "../types/bookingDateTypes";

export const getBookingDateConfig = (settings: any): BookingDateConfig => {
  const today = startOfDay(new Date());
  const isTestMode = import.meta.env.VITE_STRIPE_MODE === 'test';
  
  const minDate = isTestMode 
    ? today
    : settings?.bookingWindow?.startDate 
      ? startOfDay(new Date(settings.bookingWindow.startDate))
      : addDays(today, 1);
    
  const maxDate = isTestMode
    ? addDays(today, 365)
    : settings?.bookingWindow?.endDate
      ? startOfDay(new Date(settings.bookingWindow.endDate))
      : addDays(today, 30);

  return {
    settings,
    minDate,
    maxDate,
    isTestMode
  };
};

export const isDayExcluded = (date: Date, config: BookingDateConfig): boolean => {
  if (!config.settings) return true;
  
  const dateToCheck = startOfDay(date);
  
  if (config.isTestMode) {
    return false;
  }
  
  if (isBefore(dateToCheck, config.minDate) || isAfter(dateToCheck, config.maxDate)) {
    return true;
  }

  const dayOfWeek = dateToCheck.getDay().toString();
  const daySettings = config.settings.openingHours?.[dayOfWeek];
  
  if (!daySettings?.isOpen) {
    return true;
  }

  if (config.settings.excludedDays?.some(excludedDay => 
    startOfDay(new Date(excludedDay)).getTime() === dateToCheck.getTime()
  )) {
    return true;
  }

  return false;
};