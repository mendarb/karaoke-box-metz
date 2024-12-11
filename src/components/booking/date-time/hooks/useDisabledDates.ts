import { useState, useEffect } from "react";
import { startOfDay, isBefore, addMonths } from "date-fns";

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
        const endDate = startOfDay(addMonths(today, 2));
        
        const disabledDates: Date[] = [];
        let currentDate = startOfDay(new Date(today));
        
        while (currentDate <= endDate) {
          if (
            isBefore(currentDate, today) || 
            currentDate < minDate || 
            currentDate > maxDate ||
            isDayExcluded(currentDate)
          ) {
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