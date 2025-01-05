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
          className="rounded-md border"
          showOutsideDays={false}
          components={{
            IconLeft: ({ ...props }) => (
              <ChevronLeft 
                className="h-5 w-5 text-gray-600 hover:text-violet-600 transition-colors cursor-pointer" 
                {...props}
              />
            ),
            IconRight: ({ ...props }) => (
              <ChevronRight 
                className="h-5 w-5 text-gray-600 hover:text-violet-600 transition-colors cursor-pointer" 
                {...props}
              />
            ),
          }}
          classNames={{
            nav_button: cn(
              "w-8 h-8 bg-transparent p-0 opacity-100 hover:bg-violet-50 rounded-full transition-colors",
              "data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent"
            ),
            nav_button_previous: "-ml-1",
            nav_button_next: "-mr-1",
          }}
        />
      </div>
    </Card>
  );
};