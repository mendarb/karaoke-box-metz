import { useState, useEffect, useCallback } from "react";
import { eachDayOfInterval, startOfDay, isToday, isBefore } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";
import { isDayExcluded } from "../utils/dateConversion";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
}

export const useDisabledDates = ({ minDate, maxDate }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const { settings } = useBookingSettings();

  const calculateDisabledDates = useCallback(() => {
    if (!settings) return;

    console.log('🔄 Calcul des dates désactivées...', {
      minDate: minDate.toISOString(),
      maxDate: maxDate.toISOString(),
      settings
    });

    // Générer toutes les dates dans l'intervalle
    const dates = eachDayOfInterval({ 
      start: startOfDay(minDate), 
      end: startOfDay(maxDate) 
    });

    // Filtrer les dates désactivées et passées
    const disabledDates = dates.filter(date => {
      // Désactiver les dates passées
      if (isBefore(date, startOfDay(new Date()))) {
        return true;
      }
      return isDayExcluded(date, settings);
    });

    console.log('📅 Dates désactivées:', {
      total: disabledDates.length,
      dates: disabledDates.map(d => d.toISOString())
    });
    setDisabledDates(disabledDates);
  }, [minDate, maxDate, settings]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};