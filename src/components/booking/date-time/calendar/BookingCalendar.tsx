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
        className="border-none shadow-none [&_.rdp-nav]:relative [&_.rdp-nav]:flex [&_.rdp-nav]:justify-between [&_.rdp-nav_button]:w-10 [&_.rdp-nav_button]:h-10 [&_.rdp-nav_button]:p-0 [&_.rdp-nav_button]:flex [&_.rdp-nav_button]:items-center [&_.rdp-nav_button]:justify-center [&_.rdp-nav_button]:hover:bg-accent [&_.rdp-nav_button]:rounded-md [&_.rdp-nav_button]:z-50 [&_.rdp-nav_button:first-child]:ml-2 [&_.rdp-nav_button:last-child]:mr-2 [&_.rdp-nav_button_svg]:w-4 [&_.rdp-nav_button_svg]:h-4 [&_.rdp-nav]:z-40 [&_.rdp-nav_button]:cursor-pointer [&_.rdp-nav_button]:bg-transparent [&_.rdp-nav_button]:transition-colors [&_.rdp-nav_button]:duration-200"
      />
    </div>
  );
};