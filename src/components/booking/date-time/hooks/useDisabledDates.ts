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

    const dates = eachDayOfInterval({ 
      start: startOfDay(minDate), 
      end: startOfDay(maxDate) 
    }).filter(date => isDayExcluded(date, settings));

    setDisabledDates(dates);
  }, [minDate, maxDate, settings]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};