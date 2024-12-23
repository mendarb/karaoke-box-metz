import { useState } from "react";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarGrid } from "./calendar/CalendarGrid";
import { addMonths, subMonths } from "date-fns";
import { useBookingSettings } from "./hooks/useBookingSettings";

export const BookingCalendar = ({
  selectedDate,
  disabledDates,
  onSelect,
}: {
  selectedDate: Date;
  disabledDates: Date[];
  onSelect: (date: Date) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { minDate, maxDate } = useBookingSettings();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isPreviousMonthDisabled = minDate && subMonths(currentMonth, 1) < minDate;
  const isNextMonthDisabled = maxDate && addMonths(currentMonth, 1) > maxDate;

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        isPreviousMonthDisabled={isPreviousMonthDisabled}
        isNextMonthDisabled={isNextMonthDisabled}
      />
      <CalendarGrid
        month={currentMonth}
        selectedDate={selectedDate}
        disabledDates={disabledDates}
        onSelect={onSelect}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};