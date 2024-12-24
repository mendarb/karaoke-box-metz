import { useState, useEffect, useCallback } from "react";
import { startOfDay, eachDayOfInterval } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";
import { isDayExcluded } from "../utils/dateConversion";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
}

export const useDisabledDates = ({ minDate, maxDate }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const { settings, isTestMode } = useBookingSettings();

  const calculateDisabledDates = useCallback(() => {
    console.log('🔄 Calcul des jours désactivés...');
    console.log('📊 Settings disponibles:', settings);
    
    const dates = eachDayOfInterval({ 
      start: startOfDay(minDate), 
      end: startOfDay(maxDate) 
    }).filter(date => 
      isDayExcluded(date, settings, minDate, maxDate, isTestMode)
    );

    console.log('📅 Jours désactivés:', dates.map(d => d.toISOString()));
    setDisabledDates(dates);
  }, [minDate, maxDate, settings, isTestMode]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};