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
        className="border-none shadow-none [&_.rdp-nav]:relative [&_.rdp-nav_button]:absolute [&_.rdp-nav_button]:inset-0 [&_.rdp-nav_button]:h-full [&_.rdp-nav_button]:w-10 [&_.rdp-nav_button_content]:relative [&_.rdp-nav_button_content]:z-10"
      />
    </div>
  );
};