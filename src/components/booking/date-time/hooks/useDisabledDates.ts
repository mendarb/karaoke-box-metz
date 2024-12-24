import { useState, useEffect, useCallback } from "react";
import { startOfDay, addDays, isSameDay } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
  isDayExcluded: (date: Date) => boolean;
}

export const useDisabledDates = ({ minDate, maxDate, isDayExcluded }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const { settings } = useBookingSettings();

  const calculateDisabledDates = useCallback(() => {
    if (!settings) {
      console.log('Pas de paramètres disponibles, aucun jour désactivé');
      setDisabledDates([]);
      return;
    }

    const dates: Date[] = [];
    let currentDate = startOfDay(minDate);
    
    while (currentDate <= maxDate) {
      if (isDayExcluded(currentDate)) {
        // Vérifier qu'on n'ajoute pas de doublons
        if (!dates.some(date => isSameDay(date, currentDate))) {
          dates.push(new Date(currentDate));
        }
      }
      currentDate = addDays(currentDate, 1);
    }

    console.log('Jours désactivés calculés:', dates.map(d => d.toISOString()));
    setDisabledDates(dates);
  }, [minDate, maxDate, isDayExcluded, settings]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};