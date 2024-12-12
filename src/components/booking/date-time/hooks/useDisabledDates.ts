import { useState, useEffect } from "react";
import { startOfDay, addMonths } from "date-fns";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
  isDayExcluded: (date: Date) => boolean;
}

export const useDisabledDates = ({ minDate, maxDate, isDayExcluded }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);

  useEffect(() => {
    const calculateDisabledDates = () => {
      setIsLoadingDates(true);
      try {
        const today = startOfDay(new Date());
        const endDate = startOfDay(addMonths(today, 12)); // Extended range for test mode
        
        const disabledDates: Date[] = [];
        let currentDate = startOfDay(new Date(today));
        
        while (currentDate <= endDate) {
          // Always check against minDate regardless of test mode
          if (isDayExcluded(currentDate)) {
            disabledDates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setDisabledDates(disabledDates);
      } catch (error) {
        console.error('Error calculating disabled dates:', error);
      } finally {
        setIsLoadingDates(false);
      }
    };
    
    calculateDisabledDates();
  }, [minDate, maxDate, isDayExcluded]);

  return { disabledDates, isLoadingDates };
};