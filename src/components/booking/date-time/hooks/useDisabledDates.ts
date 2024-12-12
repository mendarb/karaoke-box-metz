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
        const endDate = maxDate;
        
        const disabledDates: Date[] = [];
        let currentDate = startOfDay(today);
        
        while (currentDate <= endDate) {
          if (isDayExcluded(currentDate)) {
            disabledDates.push(new Date(currentDate));
          }
          currentDate = addDays(currentDate, 1);
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

// Helper function
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};