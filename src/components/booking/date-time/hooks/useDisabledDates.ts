import { useState, useEffect, useCallback } from "react";
import { eachDayOfInterval, startOfDay } from "date-fns";
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

    const dates = eachDayOfInterval({ 
      start: startOfDay(minDate), 
      end: startOfDay(maxDate) 
    }).filter(date => isDayExcluded(date, settings));

    console.log('📅 Dates désactivées:', dates.map(d => d.toISOString()));
    setDisabledDates(dates);
  }, [minDate, maxDate, settings]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};