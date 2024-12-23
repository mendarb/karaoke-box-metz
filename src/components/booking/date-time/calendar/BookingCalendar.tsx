import { useState } from "react";
import { addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isAfter } from "date-fns";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

export interface BookingCalendarProps {
  selectedDate: Date | undefined;
  disabledDates: Date[];
  onSelect: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
}

export const BookingCalendar = ({ 
  selectedDate, 
  disabledDates, 
  onSelect,
  minDate,
  maxDate 
}: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMonth = addMonths(currentMonth, -1);
    // Vérifie si le nouveau mois est après ou égal au mois minimum
    if (!isBefore(startOfMonth(newMonth), startOfMonth(minDate))) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMonth = addMonths(currentMonth, 1);
    // Vérifie si le nouveau mois est avant ou égal au mois maximum
    if (!isAfter(startOfMonth(newMonth), startOfMonth(maxDate))) {
      setCurrentMonth(newMonth);
    }
  };

  const isPreviousMonthDisabled = isBefore(startOfMonth(currentMonth), startOfMonth(minDate));
  const isNextMonthDisabled = isAfter(startOfMonth(currentMonth), startOfMonth(maxDate));

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
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
  );
};