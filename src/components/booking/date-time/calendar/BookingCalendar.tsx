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
        className="border-none shadow-none [&_.rdp-nav]:flex [&_.rdp-nav]:justify-between [&_.rdp-nav]:mb-4 [&_.rdp-nav_button]:w-8 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:rounded-md [&_.rdp-nav_button]:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22currentColor%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><polyline%20points=%2215%2018%209%2012%2015%206%22></polyline></svg>')] [&_.rdp-nav_button]:bg-no-repeat [&_.rdp-nav_button]:bg-center [&_.rdp-nav_button:last-child]:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22currentColor%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><polyline%20points=%229%2018%2015%2012%209%206%22></polyline></svg>')] [&_.rdp-nav_button]:hover:bg-violet-600 [&_.rdp-nav_button]:hover:text-white [&_.rdp-nav_button]:transition-colors [&_.rdp-nav_button]:focus:outline-none [&_.rdp-nav_button]:focus:ring-2 [&_.rdp-nav_button]:focus:ring-violet-600 [&_.rdp-nav_button]:focus:ring-offset-2 [&_.rdp-nav_button_svg]:hidden"
      />
    </div>
  );
};