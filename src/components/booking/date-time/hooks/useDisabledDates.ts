import { useState, useEffect, useCallback } from "react";
import { eachDayOfInterval } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";
import { convertJsWeekDayToSettings } from "../utils/dateConversion";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
}

export const useDisabledDates = ({ minDate, maxDate }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const { settings } = useBookingSettings();

  const isDayExcluded = useCallback((date: Date) => {
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres disponibles');
      return true;
    }
    
    const settingsWeekDay = convertJsWeekDayToSettings(date.getDay());
    const daySettings = settings.openingHours[settingsWeekDay];
    
    console.log('📅 Vérification jour:', {
      date: date.toISOString(),
      settingsWeekDay,
      daySettings,
      isOpen: daySettings?.isOpen
    });
    
    return !daySettings?.isOpen;
  }, [settings]);

  const calculateDisabledDates = useCallback(() => {
    if (!settings) return;

    console.log('🔄 Calcul des jours désactivés...');
    console.log('📊 Settings disponibles:', settings);
    
    const dates = eachDayOfInterval({ start: minDate, end: maxDate })
      .filter(date => isDayExcluded(date));

    console.log('📅 Jours désactivés:', dates.map(d => d.toISOString()));
    setDisabledDates(dates);
  }, [minDate, maxDate, settings, isDayExcluded]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};