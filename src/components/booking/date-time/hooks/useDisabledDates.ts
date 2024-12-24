import { useState, useEffect, useCallback } from "react";
import { startOfDay, addDays } from "date-fns";
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
    console.log('🔄 Calcul des jours désactivés...');
    console.log('📊 Settings disponibles:', settings);
    
    if (!settings) {
      console.log('❌ Pas de paramètres disponibles, tous les jours sont désactivés');
      // Si pas de paramètres, désactiver tous les jours
      const dates: Date[] = [];
      let currentDate = startOfDay(minDate);
      while (currentDate <= maxDate) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
      setDisabledDates(dates);
      return;
    }

    const dates: Date[] = [];
    let currentDate = startOfDay(minDate);
    
    while (currentDate <= maxDate) {
      if (isDayExcluded(currentDate)) {
        // Vérifier qu'on n'ajoute pas de doublons
        if (!dates.some(date => date.getTime() === currentDate.getTime())) {
          dates.push(new Date(currentDate));
        }
      }
      currentDate = addDays(currentDate, 1);
    }

    console.log('📅 Jours désactivés:', dates.map(d => d.toISOString()));
    setDisabledDates(dates);
  }, [minDate, maxDate, isDayExcluded, settings]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};