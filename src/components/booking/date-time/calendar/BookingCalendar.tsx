import { useState } from "react";
import { addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
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
    e.preventDefault(); // Empêcher la propagation du formulaire
    setCurrentMonth(prev => addMonths(prev, -1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la propagation du formulaire
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const isPreviousMonthDisabled = startOfMonth(currentMonth) <= startOfMonth(minDate);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        isPreviousMonthDisabled={isPreviousMonthDisabled}
      />
      <CalendarGrid
        month={currentMonth}
        days={days}
        selectedDate={selectedDate}
        disabledDates={disabledDates}
        onSelect={onSelect}
      />
    </div>
  );
};