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
    console.log('🔄 Calcul des dates désactivées...');
    const calculateDisabledDates = () => {
      const dates: Date[] = [];
      let currentDate = startOfDay(minDate);
      
      while (currentDate <= maxDate) {
        if (isDayExcluded(currentDate)) {
          dates.push(new Date(currentDate));
        }
        currentDate = addDays(currentDate, 1);
      }

      console.log(`✅ ${dates.length} dates désactivées calculées`);
      setDisabledDates(dates);
    };
    
    calculateDisabledDates();
  }, [minDate, maxDate, isDayExcluded]);

  return { disabledDates };
};