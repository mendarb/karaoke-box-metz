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
        className="border-none shadow-none [&_.rdp-nav]:space-x-1 [&_.rdp-nav_button]:w-10 [&_.rdp-nav_button]:h-10 [&_.rdp-nav_button]:flex [&_.rdp-nav_button]:items-center [&_.rdp-nav_button]:justify-center [&_.rdp-nav_button]:hover:bg-accent [&_.rdp-nav_button]:rounded-md [&_.rdp-nav_button_content]:w-full [&_.rdp-nav_button_content]:h-full [&_.rdp-nav_button_content]:flex [&_.rdp-nav_button_content]:items-center [&_.rdp-nav_button_content]:justify-center"
      />
    </div>
  );
};