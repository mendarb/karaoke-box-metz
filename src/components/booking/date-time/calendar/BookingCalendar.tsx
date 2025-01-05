import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface BookingCalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  disabledDates: Date[];
  minDate: Date;
  maxDate: Date;
  defaultMonth: Date;
}

export const BookingCalendar = ({
  selectedDate,
  onSelect,
  disabledDates,
  minDate,
  maxDate,
  defaultMonth,
}: BookingCalendarProps) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelect(date)}
        disabled={(date) =>
          date < minDate ||
          date > maxDate ||
          disabledDates.some(
            (disabledDate) =>
              disabledDate.toDateString() === date.toDateString()
          )
        }
        locale={fr}
        defaultMonth={defaultMonth}
        className="border-none shadow-none"
      />
    </div>
  );
};