import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="w-full max-w-lg mx-auto">
      <div className="p-4">
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
          className="rounded-md"
          showOutsideDays={false}
          components={{
            IconLeft: ({ ...props }) => (
              <ChevronLeft 
                className="h-4 w-4 text-gray-600 hover:text-kbox-coral transition-colors" 
                {...props}
              />
            ),
            IconRight: ({ ...props }) => (
              <ChevronRight 
                className="h-4 w-4 text-gray-600 hover:text-kbox-coral transition-colors" 
                {...props}
              />
            ),
          }}
          classNames={{
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-100 hover:bg-gray-50 transition-colors",
              "data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent"
            ),
            nav_button_previous: "ml-auto",
            nav_button_next: "mr-auto",
            caption: "flex justify-center py-2 relative items-center",
            caption_label: "text-sm font-medium",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative",
            day: cn(
              "h-9 w-9 p-0 font-normal",
              "hover:bg-gray-100 hover:text-gray-900",
              "aria-selected:opacity-100",
              "rounded-full transition-all cursor-pointer"
            ),
            day_selected: "bg-kbox-coral text-white hover:bg-kbox-coral hover:text-white",
            day_today: "bg-gray-100",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-400 opacity-50",
            day_range_middle: "aria-selected:bg-gray-100",
            day_hidden: "invisible",
          }}
        />
      </div>
    </Card>
  );
};