import { useState } from "react";
import { addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarGrid } from "./calendar/CalendarGrid";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  disabledDates: Date[];
  onSelect: (date: Date) => void;
}

export const BookingCalendar = ({ selectedDate, disabledDates, onSelect }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const isPreviousMonthDisabled = startOfMonth(currentMonth) <= startOfMonth(today);

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