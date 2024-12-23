import { useState, useEffect } from "react";
import { startOfDay, addDays } from "date-fns";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
  isDayExcluded: (date: Date) => boolean;
}

export const useDisabledDates = ({ minDate, maxDate, isDayExcluded }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  useEffect(() => {
    const dates: Date[] = [];
    let currentDate = startOfDay(minDate);
    
    while (currentDate <= maxDate) {
      if (isDayExcluded(currentDate)) {
        dates.push(new Date(currentDate));
      }
      currentDate = addDays(currentDate, 1);
    }

    setDisabledDates(dates);
  }, [minDate, maxDate, isDayExcluded]);

  return { disabledDates };
};