import { useState, useEffect } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { Card } from "@/components/ui/card";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfDay, eachDayOfInterval } from "date-fns";

interface BookingCalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  disabledDates: Date[];
  minDate: Date;
  maxDate: Date;
}

export const BookingCalendar = ({
  selectedDate,
  onSelect,
  disabledDates,
  minDate,
  maxDate,
}: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const monthDays = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    }).map(date => startOfDay(date));
    
    setDays(monthDays);
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Vérifier si le mois précédent contient des dates valides
  const previousMonth = subMonths(currentMonth, 1);
  const isPreviousMonthDisabled = endOfMonth(previousMonth) < startOfDay(minDate);
  
  // Vérifier si le mois suivant contient des dates valides
  const nextMonth = addMonths(currentMonth, 1);
  const isNextMonthDisabled = startOfMonth(nextMonth) > startOfDay(maxDate);

  console.log('Calendar state:', {
    currentMonth: currentMonth.toISOString(),
    previousMonth: previousMonth.toISOString(),
    nextMonth: nextMonth.toISOString(),
    isPreviousMonthDisabled,
    isNextMonthDisabled,
    minDate: minDate.toISOString(),
    maxDate: maxDate.toISOString()
  });

  return (
    <Card className="w-full max-w-lg mx-auto">
      <div className="p-4">
        <CalendarHeader
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          isPreviousMonthDisabled={isPreviousMonthDisabled}
          isNextMonthDisabled={isNextMonthDisabled}
        />
        <CalendarGrid
          month={currentMonth}
          days={days}
          selectedDate={selectedDate}
          disabledDates={disabledDates}
          onSelect={onSelect}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </Card>
  );
};