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
        className="border-none shadow-none [&_.rdp-nav]:flex [&_.rdp-nav]:justify-between [&_.rdp-nav]:mb-4 [&_.rdp-nav_button]:w-auto [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:rounded-md [&_.rdp-nav_button]:px-3 [&_.rdp-nav_button]:bg-transparent [&_.rdp-nav_button]:hover:bg-violet-600 [&_.rdp-nav_button]:hover:text-white [&_.rdp-nav_button]:transition-colors [&_.rdp-nav_button]:focus:outline-none [&_.rdp-nav_button]:focus:ring-2 [&_.rdp-nav_button]:focus:ring-violet-600 [&_.rdp-nav_button]:focus:ring-offset-2 [&_.rdp-nav_button_previous]:before:content-['Précédent'] [&_.rdp-nav_button_next]:before:content-['Suivant'] [&_.rdp-nav_button_svg]:hidden"
      />
    </div>
  );
};